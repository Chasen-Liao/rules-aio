import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexData from "./rules-index.json" with { type: "json" };
import type { Rule, TechStack } from "./types.js";

const RULES: Rule[] = indexData as Rule[];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_DIR = path.resolve(__dirname, "..", "..", "rules");

export type Agent = "cursor" | "claude" | "codex";

const EXT: Record<Agent, string> = {
  cursor: "mdc",
  claude: "md",
  codex: "md",
};

export function allRules(): Rule[] {
  return [...RULES];
}

export function matchRules(stack: TechStack): Rule[] {
  const wanted = new Set(stack.map((t) => t.toLowerCase()));
  return RULES.filter((r) => r.tags.some((tag) => wanted.has(tag.toLowerCase())));
}

export async function readRuleContent(id: string, agent: Agent): Promise<string> {
  const file = path.join(RULES_DIR, agent, `${id}.${EXT[agent]}`);
  return readFile(file, "utf8");
}

export type { Rule, TechStack } from "./types.js";
