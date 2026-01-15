import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors"; 
import { api } from "./routes/api";
import { errorMiddleware } from "./middleware/error.middleware";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("*", errorMiddleware);
app.route("/api", api);

serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("Backend running on http://localhost:3001");
