import { Command } from "commander";
import { install } from "./installer.js";
import { uninstall } from "./uninstaller.js";
import type { Agent } from "./registry/index.js";

const VALID_AGENTS: Agent[] = ["cursor", "claude", "codex"];

function parseTargets(value: string | undefined): Agent[] | undefined {
  if (!value) return undefined;
  const parts = value.split(",").map((s) => s.trim()) as Agent[];
  const invalid = parts.filter((p) => !VALID_AGENTS.includes(p));
  if (invalid.length) {
    throw new Error(`Unknown target(s): ${invalid.join(", ")}. Valid: cursor, claude, codex.`);
  }
  return parts;
}

export async function run(argv: string[] = process.argv): Promise<void> {
  const program = new Command();

  program
    .name("rules-aio")
    .description("Auto-detect your project's tech stack and install matching coding rules.")
    .option("-y, --yes", "skip prompts; install all detected rules for all agents")
    .option("-t, --target <agents>", "comma-separated agents: cursor,claude,codex")
    .action(async (opts: { yes?: boolean; target?: string }) => {
      const targets = parseTargets(opts.target);
      await install(process.cwd(), { yes: opts.yes, targets });
    });

  program
    .command("uninstall")
    .description("Remove previously installed rules-aio rules")
    .option("-t, --target <agents>", "comma-separated agents to remove: cursor,claude,codex")
    .action(async (opts: { target?: string }) => {
      const targets = parseTargets(opts.target);
      await uninstall(process.cwd(), { targets });
    });

  await program.parseAsync(argv);
}
