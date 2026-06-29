import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

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
