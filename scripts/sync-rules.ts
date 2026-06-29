import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexData from "../src/registry/rules-index.json" with { type: "json" };
import { stripFrontmatter } from "../src/converter/util.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_DIR = path.resolve(__dirname, "..", "rules");

const UPSTREAM_BASE =
  "https://raw.githubusercontent.com/PatrickJS/awesome-cursorrules/main/rules";

const UPSTREAM_FILE: Record<string, string> = {
  nextjs: "nextjs.mdc",
  react: "react.mdc",
  typescript: "typescript.mdc",
  nodejs: "node-express.mdc",
  python: "python.mdc",
  fastapi: "fastapi.mdc",
  go: "go.mdc",
  rust: "rust-general.mdc",
};

async function fetchRaw(id: string): Promise<string> {
  const file = UPSTREAM_FILE[id];
  if (!file) throw new Error(`No upstream mapping for rule ${id}`);
  const res = await fetch(`${UPSTREAM_BASE}/${file}`);
  if (!res.ok) throw new Error(`Failed to fetch ${id}: ${res.status}`);
  return res.text();
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const rules = indexData as Array<{ id: string }>;
  for (const { id } of rules) {
    const raw = await fetchRaw(id);
    await mkdir(path.join(RULES_DIR, "cursor"), { recursive: true });
    await mkdir(path.join(RULES_DIR, "claude"), { recursive: true });
    await mkdir(path.join(RULES_DIR, "codex"), { recursive: true });

    // Cursor: always refresh the upstream original.
    await writeFile(path.join(RULES_DIR, "cursor", `${id}.mdc`), raw, "utf8");

    // Claude / Codex: only seed an initial stripped version when the file
    // does not already exist. Existing files are hand-adapted — never overwrite.
    const body = stripFrontmatter(raw);
    const claudePath = path.join(RULES_DIR, "claude", `${id}.md`);
    const codexPath = path.join(RULES_DIR, "codex", `${id}.md`);
    const claudeStatus = (await exists(claudePath)) ? "kept" : "seeded";
    const codexStatus = (await exists(codexPath)) ? "kept" : "seeded";
    if (claudeStatus === "seeded") await writeFile(claudePath, body, "utf8");
    if (codexStatus === "seeded") await writeFile(codexPath, body, "utf8");
    console.log(`synced ${id} (cursor: refreshed, claude: ${claudeStatus}, codex: ${codexStatus})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
