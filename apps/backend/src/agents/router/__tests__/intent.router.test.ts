import { describe, it, expect } from "vitest";
import { IntentBasedRouter } from "../intent.router";

describe("IntentBasedRouter", () => {
  const router = new IntentBasedRouter();

  it("routes order queries to order agent", () => {
    const result = router.classify("Where is my order?");
    expect(result.agent).toBe("order");
  });

  it("routes billing queries to billing agent", () => {
    const result = router.classify("I want a refund");
    expect(result.agent).toBe("billing");
  });

  it("falls back to support agent", () => {
    const result = router.classify("Help me login");
    expect(result.agent).toBe("support");
  });
});
