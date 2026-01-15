import { AgentContext, AgentResult } from "./types";
import {
  getOrdersByUser,
  getOrderDeliveryStatus,
} from "../tools/order.tool";

export async function orderAgent(
  message: string,
  context: AgentContext
): Promise<AgentResult> {
  // Order queries are typically stateless; context is available if needed
  const orders = await getOrdersByUser(context.userId);

  if (orders.length === 0) {
    return {
      agent: "order",
      summary: "No orders found for user",
      data: {},
      nextAction: "Ask user to confirm account or order details",
    };
  }

  const latestOrder = orders[0];
  const deliveryStatus = await getOrderDeliveryStatus(latestOrder.id);

  return {
    agent: "order",
    summary: "Fetched order delivery status",
    data: {
      orderId: latestOrder.id,
      status: deliveryStatus,
      total: latestOrder.total,
    },
    nextAction: "Inform user about delivery status",
  };
}
