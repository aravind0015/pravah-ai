import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

app.use("*", cors());

app.get("/ping", (c) => {
  return c.json({ message: "pong" });
});

export type AppType = typeof app;
