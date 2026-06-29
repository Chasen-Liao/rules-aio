const RESET = "\x1b[0m";
const FG_DEFAULT = "\x1b[39m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

const noColor =
  Boolean(process.env.NO_COLOR) || process.stdout.isTTY === false;

function fg(line: string, code: string): string {
  return noColor ? line : `${code}${line}${FG_DEFAULT}`;
}

export const green = (s: string) => fg(s, "\x1b[38;2;94;233;127m");
export const red = (s: string) => fg(s, "\x1b[38;2;248;113;113m");
export const cyan = (s: string) => fg(s, "\x1b[38;2;94;189;240m");
export const bold = (s: string) => fg(s, BOLD);
export const dim = (s: string) => fg(s, DIM);

export const check = noColor ? "[+]" : "✓";
export const cross = noColor ? "[x]" : "✗";
export const arrow = noColor ? "->" : "→";
export const dot = noColor ? "*" : "·";

export function step(label: string, detail?: string): string {
  const head = `${cyan(check)} ${bold(label)}`;
  return detail ? `${head} ${dim(detail)}` : head;
}

export function fail(label: string, detail?: string): string {
  const head = `${red(cross)} ${bold(label)}`;
  return detail ? `${head} ${dim(detail)}` : head;
}

export function info(label: string, detail?: string): string {
  const head = `${dim(arrow)} ${bold(label)}`;
  return detail ? `${head} ${dim(detail)}` : head;
}
