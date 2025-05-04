import express from "express";
import cors from "cors";
import { tools } from "./tools";

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to find specific tool by name
function findTool(name: string) {
  return tools.find((tool) => tool.function.name === name);
}

// Endpoint to read files
app.post("/read-files", async (req, res) => {
  const { paths } = req.body;
  const readFilesTool = findTool("readFiles");
  if (!readFilesTool) {
    res.status(500).json({ error: "readFiles tool not available" });
    return;
  }
  try {
    const result = await readFilesTool.function.function({ paths } as any);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint to write file
app.post("/write-file", async (req, res) => {
  const { path, content } = req.body;
  const writeFileTool = findTool("writeFile");
  if (!writeFileTool) {
    res.status(500).json({ error: "writeFile tool not available" });
    return;
  }
  try {
    const result = await writeFileTool.function.function({
      path,
      content,
    } as any);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint to execute command
app.post("/execute-command", async (req, res) => {
  const { command } = req.body;
  const executeCommandTool = findTool("executeCommand");
  if (!executeCommandTool) {
    res.status(500).json({ error: "executeCommand tool not available" });
    return;
  }
  try {
    const output = await executeCommandTool.function.function({
      command,
    } as any);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
