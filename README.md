dev agent is a minimal software development agent

it generates out a project tree to give context, and uses tools to read/edit files as needed to complete user requests

needs `OPENROUTER_API_KEY` or it's useless

install with `npm i -g dev-agent`

run with `da -m <model>`

```
Options:
  -V, --version               output the version number
  -m, --model <model>         Specify the model to use or search for available models
  -i, --ignore <ignore list>  List of directories or files to ignore
  -p, --prompt <prompt path>  Path to custom prompt file
  -b, --balance               Show balance remaining on API key
  -h, --help                  display help for command
```