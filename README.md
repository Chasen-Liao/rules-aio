# rules-aio

`rules-aio` is a planned `npx` CLI that auto-detects a project's tech stack and installs matching coding rules into Claude Code, Codex, and Cursor.

`rules-aio` 是一个计划中的 `npx` 命令行工具，用于自动识别当前项目的技术栈，并把匹配的编程规则安装到 Claude Code、Codex 和 Cursor。

The tool is designed to combine two useful workflows:

- automatic project scanning, similar to Cursor-focused rule installers
- multi-agent rule distribution across Claude Code, Codex, and Cursor

它的目标是把“自动扫描项目”和“多 Agent 规则分发”结合起来：既能自动识别项目类型，也能同时服务 Claude Code、Codex 和 Cursor。

Rule content is planned to be sourced from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules), then converted into each agent's expected format.

规则内容计划来源于 [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)，再转换成各个 Agent 原生支持的格式。

## Status

This repository is currently in the design and implementation-planning stage. Source code has not been scaffolded yet.

当前仓库处于设计和实现规划阶段，源码还未开始搭建。

Current planning documents:

- [Design spec](docs/superpowers/specs/2026-06-29-rules-aio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-06-29-rules-aio.md)

当前规划文档：

- [设计文档](docs/superpowers/specs/2026-06-29-rules-aio-design.md)
- [实现计划](docs/superpowers/plans/2026-06-29-rules-aio.md)

## Planned Usage

```bash
npx rules-aio
npx rules-aio --yes
```

The default command will scan the current project, recommend matching rules, and show an interactive selection prompt. The `--yes` flag will skip the prompt and install all detected recommended rules.

默认命令会扫描当前项目、推荐匹配规则，并显示交互式选择菜单。`--yes` 会跳过确认流程，直接安装所有检测到的推荐规则。

## Planned Outputs

`rules-aio` will write rules into the native locations used by each supported agent:

`rules-aio` 会把规则写入每个 Agent 对应的原生配置位置：

| Agent | Output |
| --- | --- |
| Cursor | `.cursor/rules/<rule>.mdc` |
| Claude Code | `.claude/rules/<rule>.md` plus managed imports in `CLAUDE.md` |
| Codex | managed rule sections in `AGENTS.md` |

Managed sections will be idempotent, so re-running the CLI updates generated blocks without duplicating them.

生成内容会使用可重复更新的 managed section，因此多次运行不会重复追加同一批规则。

## Planned Detection

The first version is planned to detect common languages and frameworks from project manifest files:

第一版计划从常见项目清单文件中检测语言和框架：

- `package.json`: React, Next.js, Vue, Node.js, TypeScript, Express, Fastify, NestJS, Tailwind CSS, Prisma
- `requirements.txt` / `pyproject.toml`: Python, FastAPI, Django, Flask
- `go.mod`: Go
- `Cargo.toml`: Rust

## Architecture

The planned implementation is split into four focused units:

计划中的实现会拆成四个职责明确的模块：

- `detector`: scans project files and returns tech-stack tags
- `registry`: stores the packaged rule index and matches rules by tag
- `converter`: converts Cursor `.mdc` rules into Cursor, Claude Code, and Codex formats
- `installer`: orchestrates detection, matching, fetching, prompting, conversion, and file writes

中文说明：

- `detector`：扫描项目文件，输出技术栈标签
- `registry`：维护打包进 npm 的规则索引，并按标签匹配规则
- `converter`：把 Cursor `.mdc` 规则转换为 Cursor、Claude Code 和 Codex 格式
- `installer`：编排检测、匹配、拉取、交互确认、转换和写入流程

## Attribution

Rule content is planned to come from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules). Each indexed rule should retain its upstream source URL and license metadata.

规则内容计划来自 [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)。每条索引规则都应保留上游来源 URL 和许可证信息。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Chasen-Liao/rules-aio&type=Date)](https://www.star-history.com/#Chasen-Liao/rules-aio&Date)
