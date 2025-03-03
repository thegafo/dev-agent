#!/usr/bin/env node

import OpenAI from "openai";
import { tools } from "./tools";
import { ask } from "./ask";
import { getCost } from "./pricing";
import { version } from "../package.json";
import chalk from "chalk";
import { loading } from "cli-loading-animation";
import { getSystemPrompt } from "./prompt";

const DEFAULT_MODEL = "openai/gpt-4o-mini";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(chalk.red("Error: OPENROUTER_API_KEY is not set."));
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

// Loading animation
const { start: startLoading, stop: stopLoading } = loading("");

async function main() {
  const systemPrompt = getSystemPrompt();
  let messages = [{ role: "system", content: systemPrompt }];
  const model = process.argv[2] || DEFAULT_MODEL;

  console.log(chalk.red(`dev-agent v${version} - ${model}`));
  console.log(chalk.blue(systemPrompt));

  let cost = 0;

  while (true) {
    const query = await ask(">>> ");
    messages = [...messages, { role: "user", content: query }];
    messages[0] = { role: "system", content: getSystemPrompt() };

    startLoading();
    let isLoading = true;

    const runner = client.beta.chat.completions
      .runTools({
        model,
        messages: messages as any,
        tools: tools as any,
        stream: true,
      })
      .on("tool_calls.function.arguments.delta", () => {
        if (!isLoading) {
          startLoading();
          isLoading = true;
        }
      })
      .on("tool_calls.function.arguments.done", (data) => {
        if (isLoading) {
          stopLoading();
          isLoading = false;
          console.log(
            chalk.green(
              `${data.name} ${JSON.stringify(JSON.parse(data.arguments))}`
            )
          );
        }
      })
      .on("content", (diff) => {
        if (isLoading) {
          stopLoading();
          isLoading = false;
        }
        process.stdout.write(chalk.blue(diff));
      });

    await runner.finalChatCompletion();
    const allCompletions = runner.allChatCompletions();
    messages = runner.messages as any;

    stopLoading();

    for (const completion of allCompletions) {
      cost += getCost(
        model,
        completion.usage?.prompt_tokens || 0,
        completion.usage?.completion_tokens || 0
      );
    }

    console.log();
    console.log(chalk.yellow(cost.toFixed(6)));
  }
}

main();
