# FileBox

FileBox 是一个 macOS 本地文件快捷访问工具，适合快速打开常用目录、整理下载文件、使用快捷窗口处理临时文件，并通过文件动态关注重点目录里的变化。

这个公开仓库用于发布 FileBox 安装包、维护公开文档、托管 Agent Skill 和 npm 安装器。FileBox App 主体源码不在这个仓库中。

## 下载与安装

**下载软件**：[前往 Releases](https://github.com/walnut-a/FileBox-Public/releases) 下载最新版本。

**系统要求**：macOS 13.0+，支持 Apple Silicon 与 Intel Mac。

**安装方法**：打开 DMG 文件后，将 FileBox 拖入 Applications 文件夹。

FileBox 完全在本地运行。它提供快捷访问、文件动态和路径查询能力，不会主动删除、移动或修改用户文件。

## 这个仓库包含什么

| 内容 | 说明 |
| --- | --- |
| [Releases](https://github.com/walnut-a/FileBox-Public/releases) | FileBox 正式安装包 |
| [`docs/agent-cli-and-skill.md`](./docs/agent-cli-and-skill.md) | FileBox CLI 与 Agent Skill 使用说明 |
| [`skills/filebox-activity`](./skills/filebox-activity) | 面向 Agent 的 FileBox Activity Skill |
| [`bin/filebox-agent-skill.js`](./bin/filebox-agent-skill.js) | Skill 安装命令入口 |
| [`scripts/check_no_secrets.sh`](./scripts/check_no_secrets.sh) | 公开仓库安全检查脚本 |

## CLI 与 Agent Skill

安装 FileBox 后，可以在应用内打开 `设置` -> `通用` -> `命令行工具`，安装只读 FileBox CLI。它在终端里的命令名是 `filebox`。

FileBox CLI 的作用是把 FileBox 里已经配置好的常用目录和文件动态输出给终端、脚本或 Agent。它只返回路径和元数据，不会删除、移动、重命名或修改文件。

CLI 目前主要提供三类能力：

- 查询常用目录：查看 FileBox 左侧常用目录，以及这些目录是否被文件动态监控。
- 查询文件动态：读取用户关注目录里的最新文件变化，支持关注后缀和全部动态两种视图。
- 输出可自动化的数据：支持 JSON 和纯路径输出，方便 Agent、Raycast、Alfred 或脚本继续处理。

常用命令：

```bash
filebox folders --json
filebox activity --focused --json --limit 20
filebox activity --all --json --limit 50
```

Agent Skill 是给模型或 Agent 读取的使用说明。它不会替代 CLI，也不会直接操作文件；它只是告诉 Agent 应该先检查 FileBox CLI 是否可用，再读取常用目录和文件动态，并优先使用用户配置的关注后缀。

面向 Agent 的 Skill 可以单独安装和更新：

```bash
npx filebox-agent-skill install
```

如果你只是自己在终端里查看文件动态，安装 CLI 就够了。如果你希望 Codex 或其他 Agent 更稳定地理解 FileBox 数据，再安装 Agent Skill。

CLI 与 Skill 的完整中文说明见 [`docs/agent-cli-and-skill.md`](./docs/agent-cli-and-skill.md)。

![](https://github.com/walnut-a/FileBox-Public/blob/main/images/filebox-settings-cli-20260428.png?raw=true)

## 核心功能

### 快捷窗口

FileBox 提供一个轻量快捷窗口，可以通过全局快捷键呼出，在不打断当前工作的情况下快速访问常用文件夹。

![](https://github.com/walnut-a/FileBox-Public/blob/main/images/filebox-quick-window-20260428.png?raw=true)

### 常用目录

可以把下载、桌面、项目目录、素材目录等路径加入左侧常用目录，减少反复在 Finder 中查找路径的时间。

![](https://github.com/walnut-a/FileBox-Public/blob/main/images/filebox-main-window-20260428.png?raw=true)

### 文件动态

FileBox 可以关注配置目录中的文件变化，并按目录分组展示最近更新的文件。用户可以通过关注后缀优先查看更重要的文件类型，例如 `md`、`app`、`dmg`、`pdf`。

### 中转与收藏

中转适合临时放置稍后要处理的文件，收藏适合固定常用文件或素材。拖拽行为可以在设置中配置为复制或移动。

## 维护检查

公开仓库提交或发布前运行：

```bash
npm run check:release
```

这会检查：

- Agent Skill 安装器测试
- 公开仓库内容结构
- npm 发布包是否误带 token 或私有内容

本地配置 `.githooks/pre-push` 后，执行 `git push` 前会自动运行同一套检查。

## 许可说明

Agent Skill 和 npm 安装器按 [`package.json`](./package.json) 中声明的 MIT license 发布。FileBox App 主体源码不在这个公开仓库中。
