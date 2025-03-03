import { exec } from "child_process";
import { promises as fs } from "fs";

type ExecuteCommandParams = { command: string };
type WriteFileParams = { path: string; contents: string };
type ReadFilesParams = { paths: string[] };

export const tools = [
  {
    type: "function",
    function: {
      name: "executeCommand",
      description: "Execute a shell command",
      function: executeCommand,
      parse: JSON.parse,
      parameters: {
        type: "object",
        properties: {
          command: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "writeFile",
      description: "Write a file to disk",
      function: writeFile,
      parse: JSON.parse,
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          contents: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "readFiles",
      description: "Read files from disk",
      function: readFiles,
      parse: JSON.parse,
      parameters: {
        type: "object",
        properties: {
          paths: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
];

async function executeCommand({
  command,
}: ExecuteCommandParams): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

async function writeFile({ path, contents }: WriteFileParams): Promise<string> {
  try {
    await fs.writeFile(path, contents, "utf8");
    return `File written to ${path}`;
  } catch (error) {
    return `Error writing file: ${(error as any)?.message}`;
  }
}

async function readFiles({
  paths,
}: ReadFilesParams): Promise<Record<string, string> | string> {
  try {
    const results: Record<string, string> = {};
    for (const path of paths) {
      results[path] = await fs.readFile(path, "utf8");
    }
    return results;
  } catch (error) {
    return `Error reading files: ${(error as any)?.message}`;
  }
}
