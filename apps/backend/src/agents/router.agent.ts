import { createRouter } from "./router/router.factory";
import { RouterDecision } from "./router/router.interface";

const ROUTER_MODE = "intent"; // later from env

export function routeMessage(message: string): RouterDecision {
  const router = createRouter(ROUTER_MODE);
  return router.classify(message);
}
