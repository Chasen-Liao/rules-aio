# rules-aio 设计文档

**日期**：2026-06-29

**npm 命令名**：`rules-aio`（仓库目录名 `rules-all-in-one`，aio = all-in-one）

**状态**：设计已确认，待写实现 plan

## 一句话

一个通过 `npx` 一键调用的 CLI 工具，自动检测当前项目的技术栈，从 PatrickJS/awesome-cursorrules 拉取匹配的编程 rules，转换格式后分别写入 Claude Code、Codex、Cursor 三套配置位置。

## 背景与动机

### 市场缺口（来自调研）

- `@gabimoncha/cursor-rules-cli`：已实现「自动扫描项目 → 只装相关 rules」，但**仅支持 Cursor**。
- `rulesync`：跨 agent 分发做得成熟（30+ agent 含 Claude Code/Codex），但**不做项目检测**，要用户自己写 rules 内容。
- `PatrickJS/awesome-cursorrules`：200+ 条按语言/框架分好类的 rules 库，内容源质量高，但没有 CLI 自动筛选。

**机会点**：把「自动检测技术栈 → 按需导入」复制到 Claude Code + Codex + Cursor，正好落在两个成熟工具中间的空白。没有任何工具在这个细分做起来。

### 风险

- rulesync 覆盖面极广，若后续加项目检测功能会直接竞争。
- 直接抓 awesome-cursorrules 的 `.mdc` 需注意 LICENSE / 署名（索引中标注来源与许可证）。

## 已确认的核心决策


| 维度          | 决策                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| rules 内容来源  | 聚合 PatrickJS/awesome-cursorrules                                                                             |
| 支持的目标 agent | Claude Code（`CLAUDE.md` + `.claude/rules/*.md` + `@import`）、Codex（`AGENTS.md`）、Cursor（`.cursor/rules/*.mdc`） |
| 项目检测机制      | 自动扫描 + 交互确认（`@inquirer/prompts` 多选，推荐项预勾选）                                                                   |
| 内容获取方式      | 混合：规则索引打包进 npm 包，rule 原始内容运行时从 GitHub raw 拉取                                                                 |
| 技术栈         | Node.js + TypeScript                                                                                         |


## 架构分层

四个独立单元，各自单一职责、可独立测试：

### 1. 检测器 `detector`

- **职责**：扫描项目根目录的清单文件（`package.json`、`go.mod`、`requirements.txt`、`pyproject.toml`、`Cargo.toml`、`pom.xml`、`composer.json` 等），推断语言与框架。
- **输出**：技术栈标识符数组，如 `["python", "react", "fastapi"]`。
- **依赖**：无。

### 2. 规则索引 `registry`

- **职责**：维护一个打包进 npm 的 JSON 索引。每条 rule 登记：名称、语言/框架标签、上游 raw URL、许可证、简短描述。
- **能力**：按技术栈查询匹配的 rule 列表。
- **依赖**：无。

### 3. 转换器 `converter`

- **职责**：把 Cursor `.mdc` 格式转换成三种目标格式。
  - Cursor：几乎透传（去除/保留 frontmatter 视情况）。
  - Claude Code：正文转成 `.claude/rules/*.md`，并在 `CLAUDE.md` 追加 `@import` 引用。
  - Codex：合并写入 `AGENTS.md`。
- **依赖**：无。按目标 agent 分离，便于未来扩展（Windsurf/Gemini 等只需新增一个转换函数）。

### 4. 安装器 `installer`

- **职责**：编排整个流程——检测 → 查询匹配 → 拉取 raw 内容 → 交互确认 → 转换 → 写入目标位置 → 打印总结。
- **依赖**：detector、registry、converter。

## 用户流程

```
用户在自己项目根目录执行：npx rules-aio
  → detector 扫描清单文件，得出如 ["react", "typescript"]
  → registry 匹配出 N 条相关 rule
  → installer 逐条 fetch 上游 raw 内容
  → 交互式多选菜单（@inquirer/prompts，N 条预勾选，可增删）
  → 用户确认
  → converter 转换为三种格式并写入：
       .cursor/rules/*.mdc        （Cursor，透传）
       .claude/rules/*.md         （Claude Code 正文）
       CLAUDE.md 追加 @import     （Claude Code 入口）
       AGENTS.md                  （Codex，合并）
  → 打印写入总结（写了哪些文件、跳过了哪些）
```

## 项目结构

```
src/
  detector/      # 各语言/清单文件的探测逻辑
  registry/      # 索引 JSON + 查询函数
  converter/     # mdc → claude / codex / cursor 转换
  installer/     # fetch + 交互确认 + 写入编排
  cli.ts         # CLI 入口（commander）
rules-index.json # 打包进 npm 的规则索引
```

## 关键设计决定

- **混合内容获取**：索引打包进 npm 包（小、可版本化），rule 原始内容运行时从 GitHub raw 拉取（保持新鲜）。
- **交互确认**：`@inquirer/prompts` 多选菜单，自动检测的推荐项预勾选，用户可自由增删。
- **预留插件化**：converter 按目标 agent 分离，未来加 Windsurf/Gemini 只需新增一个转换函数。
- **三个 agent 全支持**：Cursor 透传近乎零成本，Claude Code/Codex 才是转换重头。
- **运行时依赖**：`@inquirer/prompts`（交互）、`commander`（CLI 参数）、Node 内置 `fetch`（拉取 raw 内容）。

## 暂未纳入（YAGNI）

- 不做 rules 的评分 / 质量分级。
- 不做 rules 版本锁定或离线缓存（首版先 KISS）。
- 不做 CI/CD 自动同步上游（首版先手动同步，后续写 plan 时再细化流程）。
- 不做检测置信度展示（首版只给推荐项预勾选）。

## 待后续（writing-plans 阶段细化）

- 规则索引的同步更新流程（手动 / 半自动脚本）。
- LICENSE 与署名的具体处理方式。
- 各清单文件检测规则的完整清单与优先级。
- `.mdc` → Claude/Codex 的具体转换规则（frontmatter 去留、`@file` 引用如何处理）。

