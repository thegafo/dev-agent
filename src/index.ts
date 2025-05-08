#!/usr/bin/env node

import "./guard";

import { program } from "commander";
import { version } from "../package.json";
import { main } from "./main";
import { getAuthKeyInfo, listModels } from "./openrouter";
import inquirer from "inquirer";
import chalk from "chalk";

program
  .version(version)
  .description("dev agent")
  .option(
    "-m, --model <model>",
    "Specify the model to use or search for available models"
  )
  .option(
    "-i, --ignore <ignore list>",
    "List of directories or files to ignore"
  )
  .option("-p, --prompt <prompt path>", "Path to custom prompt file")
  .option("-b, --balance", "Show balance remaining on API key")
  .parse(process.argv);

const options = program.opts();

async function run() {
  if (options.balance) {
    try {
      const { limit_remaining } = await getAuthKeyInfo();
      console.log(`$${limit_remaining.toFixed(4)}`);
      process.exit(0);
    } catch (error) {
      console.error("Error loading API key info:", error);
      process.exit(1);
    }
  } else {
    let model = options.model;
    try {
      const models = await listModels(options.model || "");

      if (!models.length) {
        console.log(chalk.red(`Model ${options.model} not found`));
        process.exit();
      }

      if (models.length == 1) {
        model = models[0].id;
      } else {
        const choices = models.map((m: any) => {
          const { prompt, completion } = m.pricing;
          const input = Math.max(0, parseFloat(prompt) * 1e6).toFixed(2);
          const output = Math.max(0, parseFloat(completion) * 1e6).toFixed(2);
          return {
            name: `${chalk.blue(m.id)} $${input}/${output}`,
            value: m.id,
          };
        });
        const { selectedModel } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedModel",
            message: "Choose a model:",
            choices: choices,
            loop: false,
            pageSize: 10,
          },
        ]);
        model = selectedModel;
      }
    } catch (error) {
      console.error("Error fetching or selecting model:", error);
      process.exit(1);
    }
    // Run the main program with parsed options
    try {
      await main({
        model: model,
        ignore: options.ignore?.split(","),
        promptPath: options.prompt,
      });
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  }
}

run();
