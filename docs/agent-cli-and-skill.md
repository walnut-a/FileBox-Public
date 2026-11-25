# FileBox CLI 使用说明

FileBox CLI 是 FileBox App 内置的只读工具。它读取 FileBox 已有设置和文件动态缓存，把常用目录、监控目录、文件变化和文件路径输出给终端、脚本或 Agent。它在终端里的命令名是 `filebox`。

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

## CLI 不做什么

FileBox CLI 是只读工具。它不会：

- 删除文件。
- 移动文件。
- 重命名文件。
- 复制文件。
- 修改 FileBox 设置。

如果用户或 Agent 要进一步处理文件，应基于 CLI 返回的路径，再由用户明确决定下一步动作。

## 推荐 Agent 调用流程

1. 先运行 `filebox --capabilities --json`，确认 CLI 可用。
2. 再运行 `filebox folders --json`，了解用户关注哪些目录。
3. 默认运行 `filebox activity --focused --json --limit 20`，读取高价值文件动态。
4. 只有当用户需要完整记录时，再运行 `filebox activity --all --json --limit 50`。

## 文件动态从哪里来？

文件动态本来就由 FileBox 持续维护缓存。CLI 默认读缓存可以更快，也能避免每次 Agent 调用都扫描大目录。
