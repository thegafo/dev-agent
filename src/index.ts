#!/usr/bin/env node

import { program } from "commander";
import { version } from "../package.json";
import { main } from "./main";

program
  .version(version)
  .description("dev agent")
  .option("-m, --model <model>", "Specify the model to use")
  .option(
    "-i, --ignore <ignore list>",
    "List of directories or files to ignore"
  )
  .parse(process.argv);

const options = program.opts();

// Run the main program with parsed options
main({
  model: options.model,
  ignore: options.ignore?.split(","),
}).catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
