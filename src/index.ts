#!/usr/bin/env node

import "./guard";

import { program } from "commander";
import { version } from "../package.json";
import { main } from "./main";
import { printModels, getAuthKeyInfo } from "./openrouter";

program
  .version(version)
  .description("dev agent")
  .option("-m, --model <model>", "Specify the model to use")
  .option(
    "-i, --ignore <ignore list>",
    "List of directories or files to ignore"
  )
  .option("-p, --prompt <prompt path>", "Path to custom prompt file")
  .option(
    "-l, --list <query>",
    "List models, optionally filtering by search query"
  )
  .option("-b, --balance", "Show balance remaining on API key")
  .parse(process.argv);

const options = program.opts();

if (options.list !== undefined) {
  printModels(options.list || "")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error loading models:", error);
      process.exit(1);
    });
} else if (options.balance) {
  getAuthKeyInfo()
    .then(({ limit_remaining }) => {
      console.log(`$${limit_remaining.toFixed(4)}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error loading API key info:", error);
      process.exit(1);
    });
} else {
  // Run the main program with parsed options
  main({
    model: options.model,
    ignore: options.ignore?.split(","),
    promptPath: options.prompt,
  }).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}
