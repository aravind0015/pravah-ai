import { prisma } from "../db";

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: true,
    },
  });
}

export async function getOrderDeliveryStatus(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  return order?.status ?? "UNKNOWN";
}
