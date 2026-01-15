import { Context } from "hono";

export async function listAgents(c: Context) {
  return c.json([
    { type: "support", description: "General support and FAQs" },
    { type: "order", description: "Order tracking and modifications" },
    { type: "billing", description: "Payments, refunds, invoices" },
  ]);
}

export async function agentCapabilities(c: Context) {
  const type = c.req.param("type");

  const capabilities: Record<string, string[]> = {
    support: ["FAQs", "Troubleshooting", "Conversation history"],
    order: ["Order status", "Delivery tracking", "Cancellations"],
    billing: ["Invoices", "Refund status", "Payments"],
  };

  return c.json({
    type,
    capabilities: capabilities[type] ?? [],
  });
}
