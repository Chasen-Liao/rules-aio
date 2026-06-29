export interface OutputFile {
  path: string;
  content: string;
}

export function toCursor(ruleId: string, raw: string): OutputFile {
  return { path: `.cursor/rules/${ruleId}.mdc`, content: raw };
}
