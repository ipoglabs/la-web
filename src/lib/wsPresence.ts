export async function isUserOnline(userId: string): Promise<boolean> {
  const url    = process.env.WS_SERVER_URL;
  const secret = process.env.INTERNAL_SECRET;
  if (!url || !secret) return false;
  try {
    const res = await fetch(`${url}/internal/presence/${userId}`, {
      headers: { "x-internal-secret": secret },
    });
    if (!res.ok) return false;
    const { online } = await res.json() as { online: boolean };
    return online;
  } catch {
    return false;
  }
}
