import PusherServer from "pusher";

let _server: PusherServer | null = null;

export function getPusherServer(): PusherServer {
  if (!_server) {
    _server = new PusherServer({
      appId:   process.env.PUSHER_APP_ID!,
      key:     process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret:  process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS:  true,
    });
  }
  return _server;
}
