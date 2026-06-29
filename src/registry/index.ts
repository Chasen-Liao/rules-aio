import indexData from "./rules-index.json" with { type: "json" };
import type { Rule, TechStack } from "./types.js";

const RULES: Rule[] = indexData as Rule[];

export function allRules(): Rule[] {
  return RULES;
}

export function matchRules(stack: TechStack): Rule[] {
  const wanted = new Set(stack.map((t) => t.toLowerCase()));
  return RULES.filter((r) => r.tags.some((tag) => wanted.has(tag.toLowerCase())));
}

export type { Rule, TechStack } from "./types.js";
