import { readFile } from "node:fs/promises";
import path from "node:path";

async function readTextIfExists(dir: string, file: string): Promise<string | null> {
  try {
    return await readFile(path.join(dir, file), "utf8");
  } catch {
    return null;
  }
}

async function readJsonIfExists(dir: string, file: string): Promise<Record<string, unknown> | null> {
  const text = await readTextIfExists(dir, file);
  if (text === null) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const PACKAGE_DEP_MAP: Record<string, string[]> = {
  react: ["react"],
  next: ["next"],
  vue: ["vue"],
  nuxt: ["nuxt"],
  "react-native": ["react-native"],
  express: ["express"],
  fastify: ["fastify"],
  nestjs: ["@nestjs/core"],
  tailwindcss: ["tailwindcss"],
  prisma: ["@prisma/client"],
};

export async function detectProject(rootDir: string): Promise<string[]> {
  const tags = new Set<string>();

  const pkg = await readJsonIfExists(rootDir, "package.json");
  if (pkg) {
    const deps: Record<string, string> = {
      ...((pkg.dependencies as Record<string, string>) || {}),
      ...((pkg.devDependencies as Record<string, string>) || {}),
    };
    for (const [tag, depNames] of Object.entries(PACKAGE_DEP_MAP)) {
      if (depNames.some((n) => deps[n])) tags.add(tag);
    }
    if (deps["typescript"] || tags.has("next") || tags.has("nuxt")) tags.add("typescript");
    tags.add("node");
  }

  const pyproject = await readTextIfExists(rootDir, "pyproject.toml");
  const requirements = await readTextIfExists(rootDir, "requirements.txt");
  if (pyproject || requirements) {
    tags.add("python");
    const text = `${pyproject || ""}\n${requirements || ""}`.toLowerCase();
    if (text.includes("fastapi")) tags.add("fastapi");
    if (text.includes("django")) tags.add("django");
    if (text.includes("flask")) tags.add("flask");
  }

  if (await readTextIfExists(rootDir, "go.mod")) tags.add("go");
  if (await readTextIfExists(rootDir, "Cargo.toml")) tags.add("rust");

  return [...tags];
}
