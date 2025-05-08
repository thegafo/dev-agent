import chalk from "chalk";
import OpenAI from "openai";
import fetch from "node-fetch";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(chalk.red("Error: OPENROUTER_API_KEY is not set."));
  process.exit(1);
}

export const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

// List models from OpenRouter API with optional filtering by query
export async function listModels(query: string = ""): Promise<any[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const { data } = await response.json();
  let models = data.filter(
    (d: any) => d.supported_parameters.indexOf("tools") > -1
  );
  if (query && query.trim() !== "") {
    models = models.filter((m: any) =>
      m.id.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Sort models by prompt pricing
  models.sort(
    (a: any, b: any) =>
      parseFloat(a.pricing.prompt) - parseFloat(b.pricing.prompt)
  );

  return models;
}

// Get pricing for model. Returns pricing per token
export async function getPricing(
  modelId: string
): Promise<{ prompt: number; completion: number }> {
  const models = await listModels();
  const model = models.find((m: { id: string }) => m.id === modelId);
  if (!model) {
    throw new Error(`Model with id \"${modelId}\" not found`);
  }

  const { prompt, completion } = model.pricing;
  return { prompt: parseFloat(prompt), completion: parseFloat(completion) };
}

// Get OpenRouter API key usage, balance, and other info
export async function getAuthKeyInfo(): Promise<any> {
  const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch auth key info: HTTP ${response.status}`);
  }
  const { data } = await response.json();
  return data;
}
