import { Command } from "commander";
import { install } from "./installer.js";

export async function run(argv: string[] = process.argv): Promise<void> {
  const program = new Command();

  program
    .name("rules-aio")
    .description("Auto-detect your project's tech stack and install matching coding rules.")
    .option("-y, --yes", "skip the confirmation prompt and install all detected rules")
    .action(async (opts: { yes?: boolean }) => {
      await install(process.cwd(), { yes: opts.yes });
    });

  await program.parseAsync(argv);
}
