/* eslint-disable @typescript-eslint/no-magic-numbers */

// Pricing is per 1M tokens
// https://openrouter.ai/models?fmt=table&order=throughput-high-to-low&supported_parameters=tools
export const pricing: { [key: string]: { input: number; output: number } } = {
  "google/gemini-flash-2.0": {
    input: 0.1,
    output: 0.4,
  },
  "anthropic/claude-3.7-sonnet:beta": {
    input: 3,
    output: 15,
  },
  "anthropic/claude-3.5-sonnet": {
    input: 3,
    output: 15,
  },
  "anthropic/claude-3-opus": {
    input: 15,
    output: 75,
  },
  "openai/o3-mini-high": {
    input: 1.1,
    output: 4.4,
  },
  "openai/o1": {
    input: 15,
    output: 60,
  },
  "google/gemini-flash-1.5-8b": {
    input: 0.0375,
    output: 0.15,
  },
  "google/gemini-flash-1.5": {
    input: 0.075,
    output: 0.3,
  },
  "deepseek/deepseek-chat": {
    input: 2,
    output: 2,
  },
  "openai/gpt-4o-mini": {
    input: 0.15,
    output: 0.6,
  },
};

export const getCost = (
  model: string,
  inputTokens: number,
  outputTokens: number
) => {
  if (model in pricing) {
    return (
      (pricing[model].input * inputTokens) / 1e6 +
      (pricing[model].output * outputTokens) / 1e6
    );
  }
  return 0;
};
