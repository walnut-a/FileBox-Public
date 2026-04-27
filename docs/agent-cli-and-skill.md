# FileBox CLI 与 Agent Skill 说明

这份文档解释 FileBox CLI 和 `filebox-agent-skill` 分别能做什么，以及它们之间的关系。

## 两者的关系

FileBox CLI 是 FileBox App 内置的只读工具。它读取 FileBox 已有设置和文件动态缓存，把常用目录、监控目录、文件变化和文件路径输出给终端、脚本或 Agent。它在终端里的命令名是 `filebox`。

`filebox-agent-skill` 是给 Agent 使用的说明包。它不会替代 CLI，也不会直接处理文件。它的作用是告诉 Agent 应该如何调用 FileBox CLI，什么时候用关注视图，什么时候读取全部文件动态，以及什么时候需要刷新缓存。

简单来说：

| 名称 | 放在哪里 | 做什么 |
| --- | --- | --- |
| FileBox CLI | FileBox App 内置 | 读取常用目录和文件动态，输出路径与元数据 |
| `filebox-agent-skill` | 公开 npm 包和公开仓库 | 教 Agent 如何安全调用 FileBox CLI |

## 安装 CLI

先安装 FileBox App，然后在应用内打开：

`设置` -> `通用` -> `命令行工具` -> `安装`

安装完成后，终端里可以运行：

```bash
filebox --capabilities --json
```

如果命令存在，会返回当前 CLI 支持的能力。

## CLI 能做什么

### 查看常用目录

```bash
filebox folders --json
```

用途：

- 查询 FileBox 左侧常用目录。
- 知道哪些目录被文件动态监控。
- 拿到目录的真实本地路径。

### 查看文件动态

```bash
filebox activity --focused --json --limit 20
```

用途：

- 读取用户关注的文件动态。
- 默认优先使用关注后缀，比如 `md`、`app`、`dmg`、`pdf`。
- 返回目录分组、文件名、文件路径、所属目录、文件类型和更新时间。

如果需要看完整动态：

```bash
filebox activity --all --json --limit 50
```

如果只需要路径列表：

```bash
filebox activity --focused --path-only --limit 20
```

如果只看最近几天：

```bash
filebox activity --focused --json --since 3d
```

如果缓存看起来过旧，可以手动刷新：

```bash
filebox activity --focused --json --refresh --limit 20
```

`--refresh` 会扫描当前配置的监控目录，目录很大时会更慢，不建议频繁调用。

## CLI 不做什么

FileBox CLI 是只读工具。它不会：

- 删除文件。
- 移动文件。
- 重命名文件。
- 复制文件。
- 修改 FileBox 设置。

如果用户或 Agent 要进一步处理文件，应基于 CLI 返回的路径，再由用户明确决定下一步动作。

## 安装 Agent Skill

Agent Skill 可以单独安装和更新：

```bash
npx filebox-agent-skill install
```

安装后，支持 Skill 的 Agent 会读取 `filebox-activity`，知道应该先检查 CLI 能力，再读取常用目录和文件动态。

## 推荐 Agent 调用流程

1. 先运行 `filebox --capabilities --json`，确认 CLI 可用。
2. 再运行 `filebox folders --json`，了解用户关注哪些目录。
3. 默认运行 `filebox activity --focused --json --limit 20`，读取高价值文件动态。
4. 只有当用户需要完整记录时，再运行 `filebox activity --all --json --limit 50`。
5. 只有当用户明确觉得缓存过旧时，才加 `--refresh`。

## 常见问题

### 为什么 CLI 和 Skill 分开？

CLI 跟随 FileBox App 发布，负责读取本机数据。Skill 是公开说明包，负责指导 Agent 使用 CLI。两者分开后，Skill 可以独立更新，不需要用户重新安装 FileBox。

### 为什么 CLI 默认读缓存？

文件动态本来就由 FileBox 持续维护缓存。CLI 默认读缓存可以更快，也能避免每次 Agent 调用都扫描大目录。

### 为什么 Skill 不直接读取文件？

Skill 的职责是帮助 Agent 找到路径和上下文，而不是代替用户操作文件。这样更安全，也更符合 FileBox 的定位。
