import { Router, RouterDecision } from "./router.interface";

export class IntentBasedRouter implements Router {
  classify(message: string): RouterDecision {
    const text = message.toLowerCase();

    if (
      text.includes("order") ||
      text.includes("delivery") ||
      text.includes("track") ||
      text.includes("cancel")
    ) {
      return {
        agent: "order",
        reason: "Matched order-related intent keywords",
        confidence: 0.9,
      };
    }

    if (
      text.includes("payment") ||
      text.includes("refund") ||
      text.includes("invoice") ||
      text.includes("billing") ||
      text.includes("subscription")
    ) {
      return {
        agent: "billing",
        reason: "Matched billing-related intent keywords",
        confidence: 0.9,
      };
    }

    return {
      agent: "support",
      reason: "Default fallback to support",
      confidence: 0.6,
    };
  }
}
