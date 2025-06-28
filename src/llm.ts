import axios from 'axios';

interface CommitRequest {
  diff: string;
  apiKey: string;
  model: string;
  maxTokens: number;
}

const COMMIT_PROMPT = `You are a wizard coding expert that specializes in generating concise git commit messages.

Generate a commit message for the following git diff. The message should:
- Be descriptive
- Focus on what changed and why

Git diff:`;

export async function generateCommitMessage(request: CommitRequest): Promise<string> {
  const { diff, apiKey, model, maxTokens } = request;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (!diff || diff.trim().length === 0) {
    throw new Error('No changes to commit');
  }



  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model,
    messages: [
      {
        role: 'user',
        content: `${COMMIT_PROMPT}\n\n${diff}`
      }
    ],
    max_tokens: maxTokens
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const message = response.data.choices?.[0]?.message?.content?.trim();
  
  if (!message) {
    throw new Error('Failed to generate commit message');
  }

  return message;
}