import { routeMessage } from "../agents/router.agent";
import { supportAgent } from "../agents/support.agent";
import { orderAgent } from "../agents/order.agent";
import { billingAgent } from "../agents/billing.agent";
import { AgentContext, AgentResult } from "../agents/types";
import { createMessage, getConversationById } from "../tools/conversation.tool";
import { createLLMProvider } from "../llm/provider.factory";

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
export async function handleChat(
  input: ChatInput
): Promise<ChatResponse> {
  const { conversationId, userId, message } = input;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // 1. Persist user message
  await createMessage(conversationId, "user", message);

  // 2. Route message
  const routing = routeMessage(message);

  const context: AgentContext = {
    userId,
    conversationId,
  };

  // 3. Execute agent
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

  // 4. Persist agent summary (system message)
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



export async function* handleChatStream(
  input: ChatInput
): AsyncGenerator<string> {
  const response = await handleChat(input); // existing logic

  const provider = createLLMProvider();

  for await (const token of provider.stream({
    summary: response.result.summary,
    data: response.result.data,
    nextAction: response.result.nextAction,
  })) {
    yield token;
  }
}

