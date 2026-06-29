import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { checkbox } from "@inquirer/prompts";
import { detectProject } from "./detector.js";
import { allRules, matchRules } from "./registry/index.js";
import type { Rule } from "./registry/index.js";
import { toCursor, toClaudeFile, claudeImportLine, toCodexChunk } from "./converter/index.js";

const START = "<!-- rules-aio:start -->";
const END = "<!-- rules-aio:end -->";

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function writeManagedSection(filePath: string, inner: string): Promise<void> {
  let existing = "";
  try {
    existing = await readFile(filePath, "utf8");
  } catch {
    existing = "";
  }
  const block = `${START}\n${inner}\n${END}`;
  if (existing.includes(START) && existing.includes(END)) {
    const re = new RegExp(`${escapeReg(START)}[\\s\\S]*?${escapeReg(END)}`, "g");
    existing = existing.replace(re, block);
  } else {
    existing = existing.trimEnd() ? `${existing.trimEnd()}\n\n${block}\n` : `${block}\n`;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, existing, "utf8");
}

export interface InstallDeps {
  fetchRaw?: (url: string) => Promise<string>;
  prompt?: (recommended: Rule[]) => Promise<Rule[]>;
}

async function defaultFetchRaw(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function defaultPrompt(recommended: Rule[]): Promise<Rule[]> {
  const choices = allRules().map((r) => ({
    name: `${r.title} [${r.tags.join(", ")}]`,
    value: r,
    checked: recommended.includes(r),
  }));
  return checkbox({
    message: "Select rules to install (recommended pre-checked):",
    choices,
  });
}

export interface InstallOptions {
  yes?: boolean;
}

export async function install(
  rootDir: string,
  opts: InstallOptions = {},
  deps: InstallDeps = {}
): Promise<void> {
  const fetchRaw = deps.fetchRaw ?? defaultFetchRaw;
  const prompt = deps.prompt ?? defaultPrompt;

  const stack = await detectProject(rootDir);
  const recommended = matchRules(stack);
  if (recommended.length === 0) {
    console.log("No matching rules detected for this project.");
    return;
  }

  const selected = opts.yes ? recommended : await prompt(recommended);
  if (selected.length === 0) {
    console.log("No rules selected. Nothing to do.");
    return;
  }

  const importLines: string[] = [];
  const codexChunks: string[] = [];

  for (const rule of selected) {
    const raw = await fetchRaw(rule.rawUrl);

    const cursorOut = toCursor(rule.id, raw);
    await writeOutputFile(rootDir, cursorOut.path, cursorOut.content);

    const claudeOut = toClaudeFile(rule.id, raw);
    await writeOutputFile(rootDir, claudeOut.path, claudeOut.content);
    importLines.push(claudeImportLine(rule.id));

    codexChunks.push(toCodexChunk(rule.title, raw));
  }

  await writeManagedSection(path.join(rootDir, "CLAUDE.md"), importLines.join("\n"));
  await writeManagedSection(path.join(rootDir, "AGENTS.md"), codexChunks.join("\n"));

  console.log(`Installed ${selected.length} rule(s): ${selected.map((r) => r.id).join(", ")}`);
}

async function writeOutputFile(rootDir: string, relPath: string, content: string): Promise<void> {
  const abs = path.join(rootDir, relPath);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, content, "utf8");
}
