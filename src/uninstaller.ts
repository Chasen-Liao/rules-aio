import { rm } from "node:fs/promises";
import path from "node:path";
import type { Agent } from "./registry/index.js";
import { readManifest, writeManifest, removeManifest } from "./manifest.js";
import { claudeImportLine } from "./converter/index.js";
import { writeManagedSection } from "./installer.js";

export interface UninstallOptions {
  targets?: Agent[];
}

export async function uninstall(rootDir: string, opts: UninstallOptions = {}): Promise<void> {
  const manifest = await readManifest(rootDir);
  if (!manifest) {
    console.log("No rules-aio manifest found. Nothing to uninstall.");
    return;
  }

  const targets = opts.targets ?? manifest.targets;
  const remaining: Agent[] = manifest.targets.filter((t) => !targets.includes(t));
  const ruleIds = manifest.rules;

  for (const id of ruleIds) {
    if (targets.includes("cursor")) {
      await rm(path.join(rootDir, ".cursor/rules", `${id}.mdc`), { force: true });
    }
    if (targets.includes("claude")) {
      await rm(path.join(rootDir, ".claude/rules", `${id}.md`), { force: true });
    }
  }

  if (targets.includes("claude")) {
    const importLines = remaining.includes("claude")
      ? ruleIds.map((id) => claudeImportLine(id))
      : [];
    await writeManagedSection(path.join(rootDir, "CLAUDE.md"), importLines.join("\n"));
  }
  if (targets.includes("codex")) {
    // AGENTS.md stores all codex rules in one monolithic managed block.
    // Full codex removal clears the block; partial codex removal is a v1 limitation.
    if (!remaining.includes("codex")) {
      await writeManagedSection(path.join(rootDir, "AGENTS.md"), "");
    }
  }

  if (remaining.length === 0) {
    await removeManifest(rootDir);
    console.log("Uninstalled all rules-aio rules. Manifest removed.");
  } else {
    await writeManifest(rootDir, { rules: ruleIds, targets: remaining });
    console.log(`Uninstalled targets: ${targets.join(", ")}. Remaining: ${remaining.join(", ")}.`);
  }
}
