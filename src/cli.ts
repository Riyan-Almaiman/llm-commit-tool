#!/usr/bin/env node

import { Command } from 'commander';
import { getAllDiff, getStagedDiff, getFileChanges, hasChanges, stageAll, commit } from './git.js';
import { generateCommitMessage } from './llm.js';

const program = new Command();

program
  .name('commit-tool')
  .description('LLM commit message generator')
  .version('1.0.0');

program
  .command('commit')
  .description('Generate and create a commits')
  .option('-s, --stage', 'Stage all changes before committing')
  .option('-m, --model <model>', 'OpenAI model to use', 'gpt-4')
  .option('-t, --tokens <number>', 'Max tokens for response', '4096')
  .action(async (options) => {
    try {
      if (options.stage) {
        await stageAll();
        console.log('Staged all changes');
      }

      if (!options.stage) {
        const staged = await getStagedDiff();
        if (!staged || staged.length === 0) {
          console.log('No staged changes to commit. Use --stage to stage all changes first.');
          return;
        }
      } else {
        if (!(await hasChanges())) {
          console.log('No changes to commit');
          return;
        }
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.log('⚠️  OpenAI API key required!');
        console.log('Set environment variable: OPENAI_API_KEY=sk-your-key');
        process.exit(1);
      }

      const { additions, deletions, modifications } = await getFileChanges();
      console.log('Generating commit message...');

      // Build compact summary for AI
      let summary = '';
      if (additions.length > 0) {
        summary += `Added files: ${additions.join(', ')}\n`;
      }
      if (deletions.length > 0) {
        summary += `Deleted files: ${deletions.join(', ')}\n`;
      }
      if (modifications) {
        summary += `Changes:\n${modifications}`;
      }

      const message = await generateCommitMessage({
        diff: summary,
        apiKey,
        model: options.model,
        maxTokens: parseInt(options.tokens)
      });

      console.log(`Generated: ${message}`);
      
      await commit(message);
      console.log('✅ Committed successfully!');
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();