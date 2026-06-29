import { stripFrontmatter } from "./util.js";

export function toCodexChunk(title: string, raw: string): string {
  const body = stripFrontmatter(raw).trim();
  return `## ${title}\n\n${body}\n`;
}
