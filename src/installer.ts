import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { checkbox } from "@inquirer/prompts";
import { detectProject } from "./detector.js";
import { allRules, matchRules, readRuleContent, type Agent, type Rule } from "./registry/index.js";
import { claudeImportLine, toCodexChunk } from "./converter/index.js";
import { writeManifest, type Manifest } from "./manifest.js";

const ALL_AGENTS: Agent[] = ["cursor", "claude", "codex"];

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
  if (inner.trim() === "") {
    const re = new RegExp(`\n?${escapeReg(START)}[\\s\\S]*?${escapeReg(END)}\n?`, "g");
    const next = existing.replace(re, "").trimEnd();
    if (next) {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, `${next}\n`, "utf8");
    } else {
      await rm(filePath, { force: true });
    }
    return;
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

export interface InstallOptions {
  yes?: boolean;
  targets?: Agent[];
}

export async function install(rootDir: string, opts: InstallOptions = {}): Promise<void> {
  const stack = await detectProject(rootDir);
  const recommended = matchRules(stack);
  if (recommended.length === 0) {
    console.log("No matching rules detected for this project.");
    return;
  }

  const selectedRules = opts.yes ? recommended : await promptRules(recommended);
  if (selectedRules.length === 0) {
    console.log("No rules selected. Nothing to do.");
    return;
  }

  const targets = opts.targets ?? (opts.yes ? ALL_AGENTS : await promptTargets());
  if (targets.length === 0) {
    console.log("No agents selected. Nothing to do.");
    return;
  }

  const importLines: string[] = [];
  const codexChunks: string[] = [];

  for (const rule of selectedRules) {
    if (targets.includes("cursor")) {
      const content = await readRuleContent(rule.id, "cursor");
      await writeOutputFile(rootDir, `.cursor/rules/${rule.id}.mdc`, content);
    }
    if (targets.includes("claude")) {
      const content = await readRuleContent(rule.id, "claude");
      await writeOutputFile(rootDir, `.claude/rules/${rule.id}.md`, content);
      importLines.push(claudeImportLine(rule.id));
    }
    if (targets.includes("codex")) {
      const content = await readRuleContent(rule.id, "codex");
      codexChunks.push(toCodexChunk(rule.title, content));
    }
  }

  if (targets.includes("claude")) {
    await writeManagedSection(path.join(rootDir, "CLAUDE.md"), importLines.join("\n"));
  }
  if (targets.includes("codex")) {
    await writeManagedSection(path.join(rootDir, "AGENTS.md"), codexChunks.join("\n"));
  }

  const manifest: Manifest = {
    rules: selectedRules.map((r) => r.id),
    targets,
  };
  await writeManifest(rootDir, manifest);

  console.log(
    `Installed ${selectedRules.length} rule(s) for ${targets.join(", ")}: ${selectedRules.map((r) => r.id).join(", ")}`
  );
}

async function promptRules(recommended: Rule[]): Promise<Rule[]> {
  const choices = allRules().map((r) => ({
    name: `${r.title} [${r.tags.join(", ")}]`,
    value: r,
    checked: recommended.includes(r),
  }));
  return checkbox({ message: "Select rules to install (recommended pre-checked):", choices });
}

async function promptTargets(): Promise<Agent[]> {
  const choices = ALL_AGENTS.map((a) => ({ name: a, value: a, checked: true }));
  return checkbox({ message: "Select target agents:", choices });
}

async function writeOutputFile(rootDir: string, relPath: string, content: string): Promise<void> {
  const abs = path.join(rootDir, relPath);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, content, "utf8");
}
