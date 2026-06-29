import figlet from "figlet";
import { VERSION } from "./version.js";

const GRADIENT_START = { r: 0x5e, g: 0xbd, b: 0xf0 }; // sky cyan
const GRADIENT_END = { r: 0xc8, g: 0x7c, b: 0xf0 }; // violet

const RESET = "\x1b[0m";
const FG_DEFAULT = "\x1b[39m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

const noColor =
  Boolean(process.env.NO_COLOR) || process.stdout.isTTY === false;

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function rgb(t: number): { r: number; g: number; b: number } {
  return {
    r: lerp(GRADIENT_START.r, GRADIENT_END.r, t),
    g: lerp(GRADIENT_START.g, GRADIENT_END.g, t),
    b: lerp(GRADIENT_START.b, GRADIENT_END.b, t),
  };
}

function paint(line: string, c: { r: number; g: number; b: number }): string {
  if (noColor) return line;
  return `\x1b[38;2;${c.r};${c.g};${c.b}m${line}${FG_DEFAULT}`;
}

export function bannerText(): string {
  const raw = figlet.textSync("rules-aio", { font: "Slant", whitespaceBreak: true });
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);
  const n = lines.length;
  const art = lines
    .map((line, i) => paint(line.replace(/\s+$/g, ""), rgb(n <= 1 ? 0 : i / (n - 1))))
    .join("\n");

  const tagline = noColor
    ? "Auto-detect your stack · Install matching rules"
    : `${BOLD}Auto-detect your stack${RESET} ${DIM}· Install matching rules${RESET}`;
  const version = noColor ? `v${VERSION}` : `${DIM}v${VERSION}${RESET}`;

  const width = 46;
  const rule = noColor
    ? "─".repeat(width)
    : `${DIM}${"─".repeat(width)}${RESET}`;

  return `${art}\n${rule}\n  ${tagline}   ${version}\n`;
}

export function printBanner(): void {
  process.stdout.write(bannerText() + "\n");
}
