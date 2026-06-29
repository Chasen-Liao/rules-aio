import { stripFrontmatter } from "./util.js";
import type { OutputFile } from "./cursor.js";

export function toClaudeFile(ruleId: string, raw: string): OutputFile {
  return { path: `.claude/rules/${ruleId}.md`, content: stripFrontmatter(raw) };
}

export function claudeImportLine(ruleId: string): string {
  return `@.claude/rules/${ruleId}.md`;
}
