import { prisma } from "../src/db";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@pravah.ai",
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: "user",
        content: "Hi, I need help with my order",
      },
      {
        conversationId: conversation.id,
        role: "assistant",
        content: "Sure, can you share your order ID?",
      },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "SHIPPED",
      total: 1999,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "PAID",
      amount: 1999,
    },
  });

  await prisma.invoice.create({
    data: {
      paymentId: payment.id,
      url: "https://example.com/invoice/123",
    },
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
