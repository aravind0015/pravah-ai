import { routeMessage } from "../agents/router.agent";
import { supportAgent } from "../agents/support.agent";
import { orderAgent } from "../agents/order.agent";
import { billingAgent } from "../agents/billing.agent";
import { AgentContext, AgentResult } from "../agents/types";
import { createMessage, getConversationById } from "../tools/conversation.tool";
import { createLLMProvider } from "../llm/provider.factory";
import { buildContext } from "./context.service";

export interface ChatInput {
  conversationId: string;
  userId: string;
  message: string;
}

export interface ChatResponse {
  routing: {
    agent: string;
    reason: string;
  };
  result: AgentResult;
}

/**
 * Main handler for chat logic (Deterministic routing + Agent execution)
 */
export async function handleChat(input: ChatInput): Promise<ChatResponse> {
  const { conversationId, userId, message } = input;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // 1. Persist user message to DB
  await createMessage(conversationId, "user", message);

  // 2. Build conversational context for the agent
  const messages = conversation.messages.map((m) => ({
    role: m.role as "user" | "system",
    content: m.content,
  }));

  const { summary, recentMessages } = buildContext(messages);

  // 3. Route message (Deterministic Strategy)
  const routing = routeMessage(message);

  const context: AgentContext = {
    userId,
    conversationId,
    recentMessages,
    summary,
  };

  // 4. Execute the specific agent based on routing
  let result: AgentResult;

  switch (routing.agent) {
    case "order":
      result = await orderAgent(message, context);
      break;
    case "billing":
      result = await billingAgent(message, context);
      break;
    case "support":
    default:
      result = await supportAgent(message, context);
      break;
  }

  // 5. Persist agent summary to DB
  await createMessage(
    conversationId,
    "system",
    `[${result.agent}] ${result.summary}`
  );

  return {
    routing,
    result,
  };
}

/**
 * Handles the streaming LLM response based on the Agent's structured result
 */
export async function* handleChatStream(input: ChatInput): AsyncGenerator<string> {
  // Use the logic from handleChat to get structured data
  const response = await handleChat(input);

  const provider = createLLMProvider();

  // Stream tokens from the LLM provider
  for await (const token of provider.stream({
    summary: response.result.summary,
    data: response.result.data,
    nextAction: response.result.nextAction,
  })) {
    yield token;
  }
}