# Project Summary: dev-agent

## Description
"dev-agent" is a minimal software development agent that acts as an interactive AI-driven assistant. It processes user requests to aid in software development by reading, editing, generating, and managing code and project files. It leverages the OpenRouter API for language models and supports execution of commands and file operations in a streamlined manner.

## Key Features
- **Interactive CLI Tool:** The project includes a command-line interface allowing users to specify AI models, ignore certain paths, customize prompts, and check API balance.
- **OpenRouter API Integration:** Uses OpenRouter with an API key to list and interact with AI language models optimized for development tasks.
- **Model Selection:** Ability to filter, list, and select models with pricing information for cost-awareness.
- **File System Interaction:** Can read directory tree structures respecting `.gitignore` and custom ignore rules.
- **Shell Command Execution & File Manipulation Tools:** Supports executing shell commands and reading/writing files programmatically via integrated tools.
- **Prompt Customization:** Supports custom prompt files to tailor the interaction context.
- **Console UI Enhancements:** Uses colors and loading spinners for better user experience.

## Main Modules
- **src/index.ts:** Entry point; CLI setup, model selection, and main program execution.
- **src/main.ts:** Core logic for interacting with the user, sending queries to the AI model, handling responses, and tracking cost.
- **src/openrouter.ts:** API client for OpenRouter endpoints; model listing, pricing retrieval, and API key info.
- **src/tree.ts:** Generates visual directory tree respecting ignore rules.
- **src/tools.ts:** Defines tools for shell command execution and file operations.
- **src/ask.ts:** Provides asynchronous user prompt implementation via the console.
- **src/prompt.ts, prompt.txt:** Handles system prompts for the AI model.
- **src/guard.ts:** Included as a pre-requisite script (details not expanded here).

## Technology Stack
- Node.js with TypeScript
- Commander.js for CLI argument parsing
- Chalk for colored console output
- Inquirer for interactive prompts
- OpenAI and OpenRouter APIs for AI interactions
- Yocto-spinner for terminal loading indicators
- File system & path modules for directory handling
- Ignore for .gitignore parsing

## Usage
1. Install globally via npm: `npm i -g dev-agent`
2. Run using the CLI: `da -m <model>`
3. Use options to customize behavior (e.g., ignoring certain directories or using a custom prompt).
4. API key environment variable `OPENROUTER_API_KEY` must be set.

## API Configuration
Requires an OpenRouter API key set in environment variable `OPENROUTER_API_KEY`.

## License & Author
- Author: thegafo
- License: ISC

This project allows enhanced AI-powered development workflows with cost-aware model selection and execution capabilities through a minimal, ergonomic CLI tool.