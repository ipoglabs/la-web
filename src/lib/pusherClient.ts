import PusherClient from "pusher-js";

let _client: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (typeof window === "undefined") throw new Error("Pusher client is browser-only");

  if (!_client) {
    _client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      channelAuthorization: {
        endpoint:  "/api/pusher/auth",
        transport: "ajax",
      },
    });
  }

  return _client;
}
