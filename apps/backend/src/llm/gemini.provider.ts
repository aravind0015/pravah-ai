import { LLMProvider, LLMStreamInput } from "./llm.interface";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export class GeminiProvider implements LLMProvider {
  async *stream(input: LLMStreamInput): AsyncGenerator<string> {
    const prompt = `
You are a customer support agent.
Context:
${JSON.stringify(input.data, null, 2)}

Task:
${input.summary}
${input.nextAction ?? ""}
    `;

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      prompt,
    });

    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }
}
