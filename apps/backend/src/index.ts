import { serve } from "@hono/node-server";
import { app } from "./rpc";

serve({
  fetch: app.fetch,
  port: 3001
});

console.log("Backend running on http://localhost:3001");
