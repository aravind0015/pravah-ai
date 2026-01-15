import { Router, RouterDecision } from "./router.interface";

export class BertRouter implements Router {
  classify(message: string): RouterDecision {
    throw new Error(
      "BertRouter not implemented. Intended for ML-based intent classification."
    );
  }
}
