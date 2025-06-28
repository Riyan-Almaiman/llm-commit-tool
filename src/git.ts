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