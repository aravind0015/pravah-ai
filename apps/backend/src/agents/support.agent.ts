import { AgentContext, AgentResult } from "./types";

export async function supportAgent(
  message: string,
  context: AgentContext
): Promise<AgentResult> {
  // Context is already prepared by the service layer
  const recentUserMessages = context.recentMessages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  return {
    agent: "support",
    summary: "Handled general support inquiry",
    data: {
      recentMessages: recentUserMessages,
      userMessage: message,
      contextSummary: context.summary,
    },
    nextAction: "Respond with troubleshooting or FAQ guidance",
  };
}

