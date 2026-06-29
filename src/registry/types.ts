export type TechStack = string[];

export interface Rule {
  id: string;
  title: string;
  tags: string[];
  rawUrl: string;
  license: string;
  description: string;
}
