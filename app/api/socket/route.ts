import { initSocket } from "@/lib/socket";

export const dynamic = "force-dynamic";

export async function GET(_: Request) {
  // @ts-ignore
  const server = globalThis._server;
  initSocket(server);
  return new Response("Socket running");
}
