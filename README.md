# rules-aio

`rules-aio` is a planned `npx` CLI that auto-detects a project's tech stack and installs matching coding rules into Claude Code, Codex, and Cursor.

The tool is designed to bridge two existing strengths:

- automatic project scanning, similar to Cursor-focused rule installers
- multi-agent rule distribution across Claude Code, Codex, and Cursor

Rule content is planned to be sourced from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules), then converted into each agent's expected format.

## Status

This repository is currently in the design and implementation-planning stage. Source code has not been scaffolded yet.

Current planning documents:

- [Design spec](docs/superpowers/specs/2026-06-29-rules-aio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-06-29-rules-aio.md)

## Planned Usage

```bash
npx rules-aio
npx rules-aio --yes
```

The default command will scan the current project, recommend matching rules, and show an interactive selection prompt. The `--yes` flag will skip the prompt and install all detected recommended rules.

## Planned Outputs

`rules-aio` will write rules into the native locations used by each supported agent:

| Agent | Output |
| --- | --- |
| Cursor | `.cursor/rules/<rule>.mdc` |
| Claude Code | `.claude/rules/<rule>.md` plus managed imports in `CLAUDE.md` |
| Codex | managed rule sections in `AGENTS.md` |

Managed sections will be idempotent, so re-running the CLI updates generated blocks without duplicating them.

## Planned Detection

The first version is planned to detect common languages and frameworks from project manifest files:

- `package.json`: React, Next.js, Vue, Node.js, TypeScript, Express, Fastify, NestJS, Tailwind CSS, Prisma
- `requirements.txt` / `pyproject.toml`: Python, FastAPI, Django, Flask
- `go.mod`: Go
- `Cargo.toml`: Rust

## Architecture

The planned implementation is split into four focused units:

- `detector`: scans project files and returns tech-stack tags
- `registry`: stores the packaged rule index and matches rules by tag
- `converter`: converts Cursor `.mdc` rules into Cursor, Claude Code, and Codex formats
- `installer`: orchestrates detection, matching, fetching, prompting, conversion, and file writes

## Attribution

Rule content is planned to come from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules). Each indexed rule should retain its upstream source URL and license metadata.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Chasen-Liao/rules-aio&type=Date)](https://www.star-history.com/#Chasen-Liao/rules-aio&Date)
