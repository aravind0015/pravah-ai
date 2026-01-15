import { AgentContext, AgentResult } from "./types";
import {
  getPaymentByOrder,
  getInvoiceByPayment,
  getRefundStatus,
} from "../tools/billing.tool";
import { getOrdersByUser } from "../tools/order.tool";

export async function billingAgent(
  message: string,
  context: AgentContext
): Promise<AgentResult> {
  // Context is available for multi-turn billing conversations if needed
  const recentUserMessages = context.recentMessages
    ?.filter((m) => m.role === "user")
    .map((m) => m.content);

  const orders = await getOrdersByUser(context.userId);

  if (orders.length === 0) {
    return {
      agent: "billing",
      summary: "No orders available for billing lookup",
      data: {
        recentUserMessages,
      },
    };
  }

  const payment = await getPaymentByOrder(orders[0].id);

  if (!payment) {
    return {
      agent: "billing",
      summary: "No payment found for order",
      data: {
        recentUserMessages,
      },
    };
  }

  const invoice = await getInvoiceByPayment(payment.id);
  const refundStatus = await getRefundStatus(payment.id);

  return {
    agent: "billing",
    summary: "Fetched billing details",
    data: {
      paymentStatus: payment.status,
      refundStatus,
      invoiceUrl: invoice?.url ?? null,
      contextSummary: context.summary,
    },
    nextAction: "Explain billing or refund status to user",
  };
}
