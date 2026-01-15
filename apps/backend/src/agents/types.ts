export type AgentType = "support" | "order" | "billing";

export interface AgentContext {
  userId: string;
  conversationId: string;

  // conversational context
  recentMessages: {
    role: "user" | "system";
    content: string;
  }[];

  summary?: string;
}


export interface AgentResult {
  agent: AgentType;
  summary: string;              // short semantic result
  data?: Record<string, any>;   // raw data payload
  nextAction?: string;          // optional hint for UI or LLM
}
