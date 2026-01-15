import { Router } from "./router.interface";
import { IntentBasedRouter } from "./intent.router";
import { LLMRouter } from "./llm.router";
import { BertRouter } from "./bert.router";

export type RouterMode = "intent" | "llm" | "bert";

export function createRouter(mode: RouterMode): Router {
  switch (mode) {
    case "llm":
      return new LLMRouter();
    case "bert":
      return new BertRouter();
    case "intent":
    default:
      return new IntentBasedRouter();
  }
}
