// Server-side helper — replaces getPusherServer().trigger()
export async function wsEmit(room: string, event: string, data: unknown): Promise<void> {
  const url    = process.env.WS_SERVER_URL;
  const secret = process.env.INTERNAL_SECRET;
  if (!url || !secret) {
    console.warn(`wsEmit skipped (WS_SERVER_URL not set): ${event} → ${room}`);
    return;
  }
  try {
    await fetch(`${url}/internal/emit`, {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-internal-secret": secret,
      },
      body: JSON.stringify({ room, event, data }),
    });
  } catch (err) {
    console.error("wsEmit failed:", err);
  }
}
