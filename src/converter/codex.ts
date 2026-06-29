import { stripFrontmatter } from "./util.js";

export function toCodexChunk(title: string, content: string): string {
  const body = stripFrontmatter(content).trim();
  return `## ${title}\n\n${body}\n`;
}
