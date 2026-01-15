import { Context, Next } from "hono";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;

const store = new Map<
  string,
  { count: number; windowStart: number }
>();

export async function rateLimit(c: Context, next: Next) {
  const body = c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
  const userId = body.userId ?? "anonymous";

  const now = Date.now();
  const entry = store.get(userId);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(userId, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return c.json(
      { error: "Rate limit exceeded. Try again later." },
      429
    );
  }

  entry.count++;
  return next();
}
