# LLM Commit Tool

AI-powered git commit message generator using OpenAI.

## Setup

1. **Install globally:**
   ```bash
   npm install -g @ralmaiman/llm-commit-tool
   ```



2. **Set your OpenAI API key:**

   1. Go to https://platform.openai.com/api-keys
   2. Create new API key
   
   **Linux/Mac/Git Bash:**
   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```
   
   **Windows Command Prompt:**
   ```cmd
   set OPENAI_API_KEY=your-api-key-here
   ```
   
   **Windows PowerShell:**
   ```powershell
   $env:OPENAI_API_KEY="your-api-key-here"
   ```

## Usage

**Basic usage:**
```bash
# Commit only staged changes (no auto-staging)
llm-commit commit

# Stage changes and commit with AI-generated message
llm-commit commit --stage
```

**Advanced options:**
```bash
# Use specific model
llm-commit commit --stage --model gpt-4

# Adjust response length
llm-commit commit --stage --tokens 200


```
## Options

- `--stage, -s` - Stage all changes before committing
- `--model, -m` - OpenAI model to use (default: gpt-4)
- `--tokens, -t` - Max tokens for response (default: 4096)

## Examples

```bash
# Quick commit with staging
llm-commit commit -s

# Custom model and shorter messages
llm-commit commit -s -m gpt-4 -t 150

# Commit pre-staged changes only
git add file.js
llm-commit commit
```

