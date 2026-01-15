import { AgentType } from "../types";

export interface RouterDecision {
  agent: AgentType;
  reason: string;
  confidence?: number;
}

export interface Router {
  classify(message: string): RouterDecision;
}
