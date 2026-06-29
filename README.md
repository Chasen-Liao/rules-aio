# rules-aio

> One command. The right coding rules for Claude Code, Codex, and Cursor — picked for your project's actual stack.

**English** · [简体中文](README.zh-CN.md)

---

`rules-aio` is an `npx` CLI that looks at your project, figures out which languages and frameworks you use, and installs only the coding rules that matter — into every AI coding agent you run. No copy-pasting rule files. No importing a giant rules dump into your context. Just the rules that fit your project, in each agent's native format.

It combines two things that, until now, lived in separate tools:

- **Automatic project detection** — scans `package.json`, `go.mod`, `requirements.txt`, and friends to know what you're building.
- **Multi-agent distribution** — writes the same guidance into Claude Code (`CLAUDE.md`), Codex (`AGENTS.md`), and Cursor (`.cursor/rules/`), each adapted to how that agent actually reads rules.

The rule library is **community-maintained**. The Cursor variants keep the upstream originals from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules); the Claude Code and Codex variants are hand-adapted so they read naturally for each agent. **Help us keep them sharp — contributions welcome.** 👉 [Contributing](#contributing)

## Quick start

Run it from the root of the project you want to configure:

```bash
npx rules-aio                                # interactive: pick rules + target agents
npx rules-aio --yes                          # non-interactive: all detected rules, all agents
npx rules-aio --yes --target claude,cursor   # only specific agents
npx rules-aio uninstall                      # remove everything rules-aio installed
npx rules-aio uninstall --target cursor      # remove just one agent's rules
```

- `--yes` skips both prompts (rules and agents) and installs every detected rule.
- `--target` takes a comma-separated list of `cursor`, `claude`, `codex`.
- `uninstall` reads the install manifest and cleanly removes what was written.

## Where the rules go

| Agent | Output location |
| --- | --- |
| Cursor | `.cursor/rules/<rule>.mdc` |
| Claude Code | `.claude/rules/<rule>.md` + managed `@import` lines in `CLAUDE.md` |
| Codex | managed rule sections in `AGENTS.md` |

Managed sections are **idempotent** — re-running the CLI updates the generated blocks instead of duplicating them, and `uninstall` removes them cleanly.

## What gets detected

| Manifest | Detects |
| --- | --- |
| `package.json` | React, Next.js, Vue, Nuxt, Node.js, TypeScript, Express, Fastify, NestJS, Tailwind CSS, Prisma, React Native |
| `requirements.txt` / `pyproject.toml` | Python, FastAPI, Django, Flask |
| `go.mod` | Go |
| `Cargo.toml` | Rust |

Don't see your stack? That's a great first PR — see below.

## How it works

Five small, focused modules:

- **`detector`** — scans project files, returns tech-stack tags.
- **`registry`** — the packaged rule index; matches rules by tag and reads the vendored per-agent files.
- **`converter`** — builds Claude Code import lines and Codex sections.
- **`installer`** — orchestrates detect → match → prompt → write, and records an install manifest (`.rules-aio.json`).
- **`uninstaller`** — reads the manifest and removes the installed files and managed sections.

Rule content is **bundled inside the package**, so install never needs network access.

## Contributing

The rules are the heart of this project, and keeping them accurate and agent-appropriate is a community effort. **PRs are very welcome** — whether it's tightening an existing rule, adapting one better for Claude Code or Codex, or adding support for a whole new stack.

### How rules are organized

Each rule has three variants, one per agent:

```
rules/
  cursor/<id>.mdc   # upstream original, kept verbatim (refreshed by `npm run sync`)
  claude/<id>.md    # adapted for Claude Code (persistent-context directives)
  codex/<id>.md     # adapted for Codex (AGENTS.md conventions + runnable commands)
```

### Add or improve a rule

1. Add an entry to [`src/registry/rules-index.json`](src/registry/rules-index.json) with `{ id, title, tags }` (tags must match what the [detector](src/detector.ts) emits).
2. Drop the three variant files under `rules/<agent>/`.
3. For upstream-sourced Cursor rules, `npm run sync` fetches the original and **seeds** claude/codex only when those files don't yet exist — your hand-adapted versions are never overwritten.
4. Open a PR.

Good first issues: improve the depth of an existing rule, fix a Cursor-ism that slipped into a claude/codex variant, or add detection + rules for a stack that's missing (e.g. Django, Vue, Ruby, Java).

## Attribution

Rule content originates from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) (MIT). Cursor variants preserve the upstream originals; the Claude Code and Codex variants are adapted for each agent.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Chasen-Liao/rules-aio&type=Date)](https://www.star-history.com/#Chasen-Liao/rules-aio&Date)
