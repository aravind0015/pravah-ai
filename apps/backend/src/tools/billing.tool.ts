import { prisma } from "../db";

export async function getPaymentByOrder(orderId: string) {
  return prisma.payment.findFirst({
    where: { orderId },
  });
}

export async function getInvoiceByPayment(paymentId: string) {
  return prisma.invoice.findUnique({
    where: { paymentId },
  });
}

export async function getRefundStatus(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { status: true },
  });

  if (!payment) return "NOT_FOUND";

  return payment.status === "REFUNDED"
    ? "REFUNDED"
    : "NOT_REFUNDED";
}
