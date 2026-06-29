export function stripFrontmatter(raw: string): string {
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end !== -1) return raw.slice(end + 4).replace(/^\n+/, "");
  }
  return raw;
}
