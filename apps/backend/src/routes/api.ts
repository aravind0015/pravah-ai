import { Hono } from "hono";
import {
  postMessage,
  postMessageStream,
  listConversations,
  getConversation,
  deleteConversation,
} from "../controllers/chat.controller";
import {
  listAgents,
  agentCapabilities,
} from "../controllers/agent.controller";
import { healthCheck } from "../controllers/health.controller";

export const api = new Hono();

api.post("/chat/messages", postMessage);
api.post("/chat/messages/stream", postMessageStream);

api.get("/chat/conversations", listConversations);
api.get("/chat/conversations/:id", getConversation);
api.delete("/chat/conversations/:id", deleteConversation);

api.get("/agents", listAgents);
api.get("/agents/:type/capabilities", agentCapabilities);

api.get("/health", healthCheck);
