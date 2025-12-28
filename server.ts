import "dotenv/config";

import { createServer } from "http";
import next from "next";
import { initSocket } from "./lib/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const PORT = 3000;

app.prepare().then(() => {
  const server = createServer();

  // attach socket.io
  initSocket(server);

  server.on("request", (req, res) => {
    handler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
