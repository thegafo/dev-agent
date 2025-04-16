import { generateDirectoryTree } from "./tree";
import fs from "fs";
import path from "path";

const defaultPromptPath = path.resolve(__dirname, "prompt.txt");

const getSystemPrompt = (
  ignoreList?: string[],
  promptPath: string = defaultPromptPath
) => {
  const template = fs.readFileSync(promptPath, "utf-8");
  const tree = generateDirectoryTree(".", {
    extraIgnores: [
      ...(ignoreList || []),
      "dist",
      "*.log",
      "node_modules",
      ".git",
    ],
  });
  return template.replace(/{{\s*tree\s*}}/, tree);
};

export { getSystemPrompt };
