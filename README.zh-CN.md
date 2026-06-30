# rules-aio

> 一行命令，根据你的项目技术栈，为 Claude Code、Codex 和 Cursor 配上合适的编程规则。

[English](README.md) · **简体中文**

---

`rules-aio` 是一个 `npx` 命令行工具：它会查看你的项目、判断你用了哪些语言和框架，然后**只安装对你有用的编程规则**——而且同时写进你用的每一个 AI 编程 agent。无需手动复制规则文件，也无需把一大堆规则一股脑塞进上下文。只装契合你项目的规则，并且按各 agent 的原生格式落地。

它把原本分散在两个工具里的能力合二为一：

- **自动检测项目**——扫描 `package.json`、`go.mod`、`requirements.txt` 等清单文件，知道你在做什么。
- **多 agent 分发**——把同一份指导分别写进 Claude Code（`CLAUDE.md`）、Codex（`AGENTS.md`）、Cursor（`.cursor/rules/`），并按各 agent 读取规则的方式做了适配。

规则库是**社区共建**的。Cursor 版保留来自 [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) 的上游原版；Claude Code 和 Codex 版是手工适配的，让它们读起来贴合各自 agent 的习惯。**欢迎大家一起把规则维护得更好——期待你的贡献。** 👉 [参与贡献](#参与贡献)

## 快速开始

在想配置的项目根目录下运行。有两种方式：

**无需安装——直接用 `npx` 跑最新版：**

```bash
npx rules-aio
```

**或全局安装后，直接用 `rules-aio` 命令：**

```bash
npm install -g rules-aio
rules-aio
```

两种方式支持的参数完全一样：

```bash
npx rules-aio                                # 交互式：选择规则和目标 agent
npx rules-aio --yes                          # 非交互：安装所有检测到的规则，全 agent
npx rules-aio --yes --target claude,cursor   # 只装指定 agent
npx rules-aio uninstall                      # 移除 rules-aio 安装的全部内容
npx rules-aio uninstall --target cursor      # 只移除某个 agent 的规则
```

- `--yes` 跳过两道确认（规则与 agent），安装所有检测到的规则。
- `--target` 接受逗号分隔的 `cursor`、`claude`、`codex`。
- `uninstall` 读取安装清单，干净地移除已写入的内容。

## 规则写到哪里

| Agent | 写入位置 |
| --- | --- |
| Cursor | `.cursor/rules/<rule>.mdc` |
| Claude Code | `.claude/rules/<rule>.md` + `CLAUDE.md` 中受管理的 `@import` 行 |
| Codex | `AGENTS.md` 中受管理的规则段落 |

受管理段落是**幂等**的——重复运行会更新而非重复追加，`uninstall` 也能干净移除。

## 支持的检测

| 清单文件 | 可检测 |
| --- | --- |
| `package.json` | React、Next.js、Vue、Nuxt、Node.js、TypeScript、Express、Fastify、NestJS、Tailwind CSS、Prisma、React Native |
| `requirements.txt` / `pyproject.toml` | Python、FastAPI、Django、Flask |
| `go.mod` | Go |
| `Cargo.toml` | Rust |

没看到你的技术栈？这正是个不错的首个 PR——见下文。

## 工作原理

五个职责清晰的小模块：

- **`detector`**——扫描项目文件，输出技术栈标签。
- **`registry`**——打包进 npm 的规则索引；按标签匹配规则，并读取本地各 agent 的规则文件。
- **`converter`**——生成 Claude Code 的 import 行和 Codex 的章节。
- **`installer`**——编排「检测 → 匹配 → 确认 → 写入」流程，并记录安装清单（`.rules-aio.json`）。
- **`uninstaller`**——读取清单，移除已安装的文件和受管理段落。

规则内容**打包在包内**，安装时无需联网。

## 参与贡献

规则是这个项目的核心，让它们保持准确、贴合各 agent，是一项社区工作。**非常欢迎 PR**——无论是收紧某条规则、把某条规则更好地适配到 Claude Code 或 Codex，还是补上一个全新的技术栈。

### 规则的组织方式

每条规则有三个变体，每个 agent 一个：

```
rules/
  cursor/<id>.mdc   # 上游原版，逐字保留（由 `npm run sync` 刷新）
  claude/<id>.md    # Claude Code 适配（持久上下文指令）
  codex/<id>.md     # Codex 适配（AGENTS.md 约定 + 可执行命令）
```

### 新增或改进一条规则

1. 在 [`src/registry/rules-index.json`](src/registry/rules-index.json) 加一条 `{ id, title, tags }`（tags 要和 [detector](src/detector.ts) 输出的一致）。
2. 在 `rules/<agent>/` 下放入三个变体文件。
3. Cursor 规则若来自上游，`npm run sync` 会拉取原版，并**仅当** claude/codex 文件不存在时才生成初始版本——你手工改写的版本绝不会被覆盖。
4. 提交 PR。

适合上手的方向：加深某条规则的内容、清掉 claude/codex 变体里残留的 Cursor 专属写法，或为缺失的技术栈补上检测和规则（如 Django、Vue、Ruby、Java）。

## 致谢

规则内容来自 [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)（MIT）。Cursor 版保留上游原版；Claude Code 与 Codex 版针对各自 agent 做了适配。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Chasen-Liao/rules-aio&type=Date)](https://www.star-history.com/#Chasen-Liao/rules-aio&Date)
