#!/usr/bin/env node

import { tools } from "./tools";
import { ask } from "./ask";
import { version } from "../package.json";
import chalk from "chalk";
import { getSystemPrompt } from "./prompt";
import { client, getPricing } from "./openrouter";
import yoctoSpinner from "yocto-spinner";

const DEFAULT_MODEL = "openai/gpt-4.1-nano";

interface Options {
  model?: string;
  ignore?: string[];
  promptPath?: string;
}

// Loading animation
const spinner = yoctoSpinner();

export async function main(options: Options = {}) {
  const systemPrompt = getSystemPrompt(options.ignore, options.promptPath);
  let messages = [{ role: "system", content: systemPrompt }];
  const model = options.model || DEFAULT_MODEL;

  let pricing = { prompt: 0, completion: 0 };
  try {
    pricing = await getPricing(model);
  } catch (err) {
    console.log(chalk.red(`Model ${model} not available...`));
    process.exit();
  }

  const input = (pricing.prompt * 1e6).toFixed(2);
  const output = (pricing.completion * 1e6).toFixed(2);

  console.log(chalk.red(`dev-agent v${version} - ${model}`));
  console.log(chalk.yellow(`input: $${input}/M, output: $${output}/M`));
  console.log(chalk.blue(systemPrompt));

  let cost = 0;

  while (true) {
    const query = await ask(">>> ");
    messages = [...messages, { role: "user", content: query }];
    messages[0] = {
      role: "system",
      content: getSystemPrompt(options.ignore, options.promptPath),
    };

    spinner.start();
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
          spinner.start();
          isLoading = true;
        }
      })
      .on("tool_calls.function.arguments.done", (data) => {
        if (isLoading) {
          spinner.stop();
          isLoading = false;
          const args = JSON.parse(data.arguments);
          if (data.name === "readFiles") {
            console.log(chalk.green(`Reading files ${args.paths.join(", ")}`));
          } else if (data.name === "writeFile") {
            console.log(chalk.green(`Writing file ${args.path}`));
          } else if (data.name === "executeCommand") {
            console.log(chalk.green(`Executing command ${args.command}`));
          }
        }
      })
      .on("content", (diff) => {
        if (isLoading) {
          spinner.stop();
          isLoading = false;
        }
        process.stdout.write(chalk.blue(diff));
      })
      .on("content.done", () => {
        console.log();
      });

    await runner.finalChatCompletion();
    const allCompletions = runner.allChatCompletions();
    messages = runner.messages as any;

    spinner.stop();

    for (const completion of allCompletions) {
      cost +=
        pricing.prompt * (completion.usage?.prompt_tokens || 0) +
        pricing.completion * (completion.usage?.completion_tokens || 0);
    }

    console.log();
    console.log(chalk.yellow(cost.toFixed(6)));
  }
}
