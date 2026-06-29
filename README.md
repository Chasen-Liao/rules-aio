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

The CLI is implemented and working: `npx rules-aio` detects a project's tech stack and installs matching rules into Claude Code, Codex, and Cursor. Tests pass and the package builds cleanly.

CLI 已实现并可用：`npx rules-aio` 会检测项目技术栈，并把匹配的规则安装到 Claude Code、Codex 和 Cursor。测试通过，构建无误。

Reference documents:

- [Design spec](docs/superpowers/specs/2026-06-29-rules-aio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-06-29-rules-aio.md)

参考文档：

- [设计文档](docs/superpowers/specs/2026-06-29-rules-aio-design.md)
- [实现计划](docs/superpowers/plans/2026-06-29-rules-aio.md)

## Usage

```bash
npx rules-aio                                # interactive: pick rules + agents
npx rules-aio --yes                          # non-interactive, all detected rules, all agents
npx rules-aio --yes --target claude,cursor   # only the given agents
npx rules-aio uninstall                      # remove installed rules
npx rules-aio uninstall --target cursor      # remove only one agent's rules
```

The default command scans the current project, recommends matching rules, and shows interactive prompts to pick rules and target agents. `--yes` skips both prompts. `--target` selects specific agents (`cursor`, `claude`, `codex`). `uninstall` reads the install manifest and removes what was installed.

默认命令会扫描当前项目、推荐匹配规则，并通过交互菜单选择规则和目标 agent。`--yes` 跳过两道确认。`--target` 指定目标 agent（`cursor`、`claude`、`codex`）。`uninstall` 读取安装清单并移除已安装的内容。

## Outputs

`rules-aio` writes rules into the native locations used by each supported agent:

`rules-aio` 会把规则写入每个 Agent 对应的原生配置位置：

| Agent | Output |
| --- | --- |
| Cursor | `.cursor/rules/<rule>.mdc` |
| Claude Code | `.claude/rules/<rule>.md` plus managed imports in `CLAUDE.md` |
| Codex | managed rule sections in `AGENTS.md` |

Managed sections will be idempotent, so re-running the CLI updates generated blocks without duplicating them.

生成内容会使用可重复更新的 managed section，因此多次运行不会重复追加同一批规则。

Rule content is bundled inside the package (no network access at install time). The Cursor variant keeps the upstream original; the Claude Code and Codex variants are adapted for each agent.

规则内容打包在包内（安装时无需联网）。Cursor 版保留上游原版；Claude Code 与 Codex 版针对各自 agent 做了适配改写。

## Detection

The first version detects common languages and frameworks from project manifest files:

第一版会从常见项目清单文件中检测语言和框架：

- `package.json`: React, Next.js, Vue, Node.js, TypeScript, Express, Fastify, NestJS, Tailwind CSS, Prisma
- `requirements.txt` / `pyproject.toml`: Python, FastAPI, Django, Flask
- `go.mod`: Go
- `Cargo.toml`: Rust

## Architecture

The implementation is split into four focused units:

实现拆成四个职责明确的模块：

- `detector`: scans project files and returns tech-stack tags
- `registry`: stores the packaged rule index, matches rules by tag, and reads the vendored per-agent rule files
- `converter`: builds Claude Code import lines and Codex sections
- `installer`: orchestrates detection, matching, prompting, target selection, and file writes; records an install manifest
- `uninstaller`: reads the manifest and removes installed files and managed sections

中文说明：

- `detector`：扫描项目文件，输出技术栈标签
- `registry`：维护打包进 npm 的规则索引，按标签匹配规则，并读取本地各 agent 的规则文件
- `converter`：生成 Claude Code 的 import 行和 Codex 的章节
- `installer`：编排检测、匹配、交互确认、目标选择和写入流程，并记录安装清单
- `uninstaller`：读取清单，移除已安装的文件和 managed section

## Attribution

Rule content comes from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) (MIT). The Cursor variant keeps the upstream original; the Claude Code and Codex variants are adapted for each agent.

规则内容来自 [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)（MIT）。Cursor 版保留上游原版；Claude Code 与 Codex 版针对各自 agent 做了适配。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Chasen-Liao/rules-aio&type=Date)](https://www.star-history.com/#Chasen-Liao/rules-aio&Date)
