import { describe, it, expect, vi } from "vitest";
import { handleChat } from "../chat.service";

// ---- MOCK DEPENDENCIES ----

// Mock conversation tools
vi.mock("../../tools/conversation.tool", () => ({
  getConversationById: vi.fn().mockResolvedValue({
    id: "conv-1",
    messages: [],
  }),
  createMessage: vi.fn().mockResolvedValue(undefined),
}));

// Mock router
vi.mock("../../agents/router.agent", () => ({
  routeMessage: vi.fn().mockReturnValue({
    agent: "order",
    reason: "matched order intent",
  }),
}));

// Mock order agent
vi.mock("../../agents/order.agent", () => ({
  orderAgent: vi.fn().mockResolvedValue({
    agent: "order",
    summary: "Fetched order delivery status",
    data: { status: "SHIPPED" },
    nextAction: "Inform user",
  }),
}));

describe("Chat Service", () => {
  it("routes and executes an order request", async () => {
    const result = await handleChat({
      userId: "user-1",
      conversationId: "conv-1",
      message: "Where is my order?",
    });

    expect(result.routing.agent).toBe("order");
    expect(result.result.agent).toBe("order");
    expect(result.result.data.status).toBe("SHIPPED");
  });
});
