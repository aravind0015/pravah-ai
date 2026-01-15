import { AgentContext, AgentResult } from "./types";
import { getRecentMessages } from "../tools/conversation.tool";

export async function supportAgent(
  message: string,
  context: AgentContext
): Promise<AgentResult> {
  const recentMessages = await getRecentMessages(
    context.conversationId,
    5
  );

  return {
    agent: "support",
    summary: "Handled general support inquiry",
    data: {
      recentMessages,
      userMessage: message,
    },
    nextAction: "Respond with troubleshooting or FAQ guidance",
  };
}
