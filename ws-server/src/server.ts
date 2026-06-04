import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET      = process.env.JWT_SECRET!;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET!;
const CLIENT_ORIGIN   = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const PORT            = parseInt(process.env.PORT || "4000");

// Accept the configured origin plus any Vercel preview/branch deployments
function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true; // server-to-server calls have no origin
  if (origin === CLIENT_ORIGIN) return true;
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  if (origin === "http://localhost:3000") return true;
  return false;
}

const httpServer = createServer(handleHttp);

const io = new Server(httpServer, {
  cors: {
    origin:      (origin, cb) => cb(null, isAllowedOrigin(origin)),
    credentials: true,
  },
  transports:   ["polling", "websocket"],
  pingTimeout:  60_000,
  pingInterval: 25_000,
});

// ── Presence tracking (connection count per userId) ───────────────────────────
// For multi-node Redis deployments, replace this Map with Redis INCR/DECR.
const onlineCount = new Map<string, number>();

async function attachRedis() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log("⚠  No REDIS_URL — using in-memory adapter (single node only)");
    return;
  }
  const { createClient }  = await import("redis");
  const { createAdapter } = await import("@socket.io/redis-adapter");
  const pub = createClient({ url: redisUrl });
  const sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  io.adapter(createAdapter(pub, sub));
  console.log("✓ Redis adapter connected");
}

// ── Auth middleware ───────────────────────────────────────────────────────────
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error("unauthorized"));
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    socket.data.userId = payload.userId;
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});

// ── Connection handler ────────────────────────────────────────────────────────
io.on("connection", (socket: Socket) => {
  const userId: string = socket.data.userId;

  // Personal room
  socket.join(`user:${userId}`);

  // ── Presence: mark online ────────────────────────────────────────────────
  const prev = onlineCount.get(userId) ?? 0;
  onlineCount.set(userId, prev + 1);
  if (prev === 0) {
    // Broadcast to anyone watching this user's presence room
    io.to(`presence:${userId}`).emit("user:online", { userId });
  }

  // ── Conversation rooms ───────────────────────────────────────────────────
  socket.on("join:conversation", (convId: unknown) => {
    if (typeof convId === "string" && /^[a-f\d]{24}$/i.test(convId)) {
      socket.join(`conv:${convId}`);
    }
  });

  socket.on("leave:conversation", (convId: unknown) => {
    if (typeof convId === "string") socket.leave(`conv:${convId}`);
  });

  // ── Presence: watch/unwatch another user ────────────────────────────────
  socket.on("watch:presence", (targetId: unknown) => {
    if (typeof targetId !== "string" || !/^[a-f\d]{24}$/i.test(targetId)) return;
    socket.join(`presence:${targetId}`);
    // Immediately tell client whether target is online right now
    const isOnline = (onlineCount.get(targetId) ?? 0) > 0;
    socket.emit("presence:status", { userId: targetId, online: isOnline });
  });

  socket.on("unwatch:presence", (targetId: unknown) => {
    if (typeof targetId === "string") socket.leave(`presence:${targetId}`);
  });

  // ── Typing relay (sender excluded by socket.to()) ───────────────────────
  socket.on("typing:start", (convId: unknown) => {
    if (typeof convId === "string" && /^[a-f\d]{24}$/i.test(convId)) {
      socket.to(`conv:${convId}`).emit("typing:start", { userId });
    }
  });

  socket.on("typing:stop", (convId: unknown) => {
    if (typeof convId === "string" && /^[a-f\d]{24}$/i.test(convId)) {
      socket.to(`conv:${convId}`).emit("typing:stop", { userId });
    }
  });

  // ── Presence: mark offline on disconnect ────────────────────────────────
  socket.on("disconnect", () => {
    const cur = onlineCount.get(userId) ?? 1;
    if (cur <= 1) {
      onlineCount.delete(userId);
      io.to(`presence:${userId}`).emit("user:offline", { userId });
    } else {
      onlineCount.set(userId, cur - 1);
    }
  });
});

// ── Internal HTTP endpoint ────────────────────────────────────────────────────
function handleHttp(req: IncomingMessage, res: ServerResponse) {
  if (req.headers["x-internal-secret"] !== INTERNAL_SECRET) {
    res.writeHead(403).end();
    return;
  }

  // GET /internal/presence/:userId — check if a user is currently connected
  if (req.method === "GET" && req.url?.startsWith("/internal/presence/")) {
    const userId  = req.url.slice("/internal/presence/".length);
    const online  = (onlineCount.get(userId) ?? 0) > 0;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ online }));
    return;
  }

  // POST /internal/emit — broadcast a socket event to a room
  if (req.method === "POST" && req.url === "/internal/emit") {
    let body = "";
    req.on("data", (chunk: Buffer) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const { room, event, data } = JSON.parse(body) as {
          room: string; event: string; data: unknown;
        };
        io.to(room).emit(event, data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400).end();
      }
    });
    return;
  }

  res.writeHead(404).end();
}

async function main() {
  await attachRedis();
  httpServer.listen(PORT, () => console.log(`✓ WS server on :${PORT}`));
}

main().catch((err) => { console.error(err); process.exit(1); });
