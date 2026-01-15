import { LLMProvider, LLMStreamInput } from "./llm.interface";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export class MockLLMProvider implements LLMProvider {
  async *stream(input: LLMStreamInput): AsyncGenerator<string> {
    const text = `
${input.summary}.
Details: ${JSON.stringify(input.data, null, 2)}.
Next: ${input.nextAction ?? ""}
    `.trim();

    for (const word of text.split(" ")) {
      yield word + " ";
      await sleep(80);
    }
  }
}
