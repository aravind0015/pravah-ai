import { Router, RouterDecision } from "./router.interface";

export class LLMRouter implements Router {
  classify(message: string): RouterDecision {
    throw new Error(
      "LLMRouter not implemented. Intended to use LLM-based intent classification."
    );
  }
}
