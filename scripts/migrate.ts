import "dotenv/config";

import { up } from "../migrations/001-create-indexes";

(async () => {
  await up();
  console.log("Migration done");
  process.exit(0);
})();
