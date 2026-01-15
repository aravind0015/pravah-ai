import { LLMProvider } from "./llm.interface";
import { MockLLMProvider } from "./mock.provider";
import { GeminiProvider } from "./gemini.provider";

export function createLLMProvider(): LLMProvider {
  if (process.env.LLM_PROVIDER === "gemini") {
    return new GeminiProvider();
  }
  return new MockLLMProvider();
}
