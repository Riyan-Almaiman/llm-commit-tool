import { simpleGit } from 'simple-git';

const git = simpleGit();

export async function getStagedDiff(): Promise<string> {
  try {
    return await git.diff(['--cached']);
  } catch (error) {
    return '';
  }
}

export async function getUnstagedDiff(): Promise<string> {
  try {
    return await git.diff();
  } catch (error) {
    return '';
  }
}

export async function getAllDiff(): Promise<string> {
  const staged = await getStagedDiff();
  const unstaged = await getUnstagedDiff();
  return staged + unstaged;
}

export async function getFileChanges(): Promise<{ additions: string[], deletions: string[], modifications: string }> {
  try {
    const status = await git.status();
    
    const additions: string[] = [];
    const deletions: string[] = [];
    
    status.files.forEach(file => {
      if (file.index === 'A' || file.working_dir === 'A') {
        additions.push(file.path);
      } else if (file.index === 'D' || file.working_dir === 'D') {
        deletions.push(file.path);
      }
    });
    
    // Get diff for modifications only (exclude additions/deletions)
    const modifiedDiff = await git.diff(['--cached', '--diff-filter=M']);
    
    return {
      additions,
      deletions,
      modifications: modifiedDiff
    };
  } catch (error) {
    return {
      additions: [],
      deletions: [],
      modifications: await getAllDiff()
    };
  }
}

export async function hasChanges(): Promise<boolean> {
  // Check if there are any staged changes ready to commit
  const staged = await getStagedDiff();
  if (staged.length > 0) return true;
  
  // If no staged changes, check if there are unstaged changes that could be staged
  const unstaged = await getUnstagedDiff();
  return unstaged.length > 0;
}

export async function stageAll(): Promise<void> {
  await git.add(['-A']);
}

export async function commit(message: string): Promise<void> {
  await git.commit(message);
}

export async function getStatus(): Promise<string> {
  try {
    const status = await git.status();
    return status.files.map(file => `${file.index}${file.working_dir} ${file.path}`).join('\n');
  } catch (error) {
    return '';
  }
}