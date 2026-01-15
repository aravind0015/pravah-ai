import { Context } from "hono";
import { handleChat } from "../services/chat.service";
import { prisma } from "../db";
import { stream } from "hono/streaming";
import { handleChatStream } from "../services/chat.service";

export async function postMessage(c: Context) {
  const body = await c.req.json();

  const { conversationId, userId, message } = body;

  if (!conversationId || !userId || !message) {
    return c.json(
      { error: "conversationId, userId and message are required" },
      400
    );
  }

  const response = await handleChat({
    conversationId,
    userId,
    message,
  });

  return c.json(response);
}

export async function listConversations(c: Context) {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return c.json(conversations);
}

export async function getConversation(c: Context) {
  const id = c.req.param("id");

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json(conversation);
}

export async function deleteConversation(c: Context) {
  const id = c.req.param("id");

  await prisma.message.deleteMany({
    where: { conversationId: id },
  });

  await prisma.conversation.delete({
    where: { id },
  });

  return c.json({ success: true });
}


export async function postMessageStream(c: Context) {
  const body = await c.req.json();
  const { conversationId, userId, message } = body;

  return stream(c, async (stream) => {
    for await (const chunk of handleChatStream({
      conversationId,
      userId,
      message,
    })) {
      await stream.write(chunk);
    }
  });
}
