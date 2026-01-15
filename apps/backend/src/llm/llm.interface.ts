export interface LLMStreamInput {
  summary: string;
  data?: Record<string, any>;
  nextAction?: string;
}

export interface LLMProvider {
  stream(input: LLMStreamInput): AsyncGenerator<string>;
}
