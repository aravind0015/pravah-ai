import { hc } from "hono/client";
import type { AppType } from "@pravah/backend/src/rpc";

export const client = hc<AppType>("http://localhost:3001");
