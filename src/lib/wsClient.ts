"use client";

import { io, Socket } from "socket.io-client";

// Promise singleton — all concurrent getSocket() calls share one promise.
// This prevents the race condition where multiple calls before the token
// fetch resolves each create a new socket, overwriting previous handlers.
let socketPromise: Promise<Socket> | null = null;

export function getSocket(): Promise<Socket> {
  if (socketPromise) return socketPromise;

  socketPromise = (async () => {
    const res = await fetch("/api/auth/ws-token");
    if (!res.ok) throw new Error("Not authenticated");
    const { token } = (await res.json()) as { token: string };

    return io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth:                 { token },
      // Start with polling so the HTTP handshake always completes,
      // then upgrade to WebSocket. This survives proxies that block
      // direct WS upgrades and gives a fallback if WS is flaky.
      transports:           ["polling", "websocket"],
      upgrade:              true,
      reconnection:         true,
      reconnectionAttempts: 20,
      reconnectionDelay:    1000,
      reconnectionDelayMax: 5000,
    });
  })();

  return socketPromise;
}

export function disconnectSocket() {
  if (socketPromise) {
    socketPromise.then((sock) => sock.disconnect()).catch(() => {});
    socketPromise = null;
  }
}
