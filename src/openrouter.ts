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

// List models from OpenRouter API
export async function listModels(): Promise<any[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const { data } = await response.json();
  return data.filter((d: any) => d.supported_parameters.indexOf("tools") > -1);
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

export async function printModels(query: string) {
  const models = await listModels();
  const filteredModels = models.filter((m) =>
    m.id.toLowerCase().includes(query.toLowerCase())
  );
  if (filteredModels.length === 0) {
    console.log(chalk.yellow("No models found matching query:"), query);
    return;
  }
  console.log(
    chalk.green(
      filteredModels
        .map((m) => {
          const { prompt, completion } = m.pricing;
          const input = Math.max(0, parseFloat(prompt) * 1e6).toFixed(2);
          const output = Math.max(0, parseFloat(completion) * 1e6).toFixed(2);
          return `${chalk.blue(m.id)} $${input}/${output}`;
        })
        .join("\n")
    )
  );
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
