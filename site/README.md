# getfilebox.app

这是 FileBox 的公开官网，部署到 Cloudflare Pages，域名为 `getfilebox.app`。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

Cloudflare Pages 输出目录为 `dist`，配置见 [`wrangler.toml`](./wrangler.toml)。

## Cloudflare 部署

Pages 项目名为 `getfilebox-app`，生产分支为 `main`。

手动部署：

```bash
npm run build
npx wrangler pages deploy dist --project-name getfilebox-app --branch main
```

自定义域名需要在 Cloudflare Pages 的 Custom Domains 中添加 `getfilebox.app`，并在 `getfilebox.app` 这个 zone 里配置 DNS：

| 类型 | 名称 | 目标 | 代理 |
| --- | --- | --- | --- |
| CNAME | `@` | `getfilebox-app.pages.dev` | 开启 |

验证：

```bash
curl -I https://getfilebox-app.pages.dev
curl -I https://getfilebox.app
```

## 设计方向

- 目标用户：需要快速访问常用目录、整理下载文件、关注文件动态，并把路径交给 Agent 的 Mac 用户。
- 品牌感觉：安静、温暖、可靠。
- 视觉方向：以 FileBox 纸盒图标的暖色和 macOS 原生窗口感为基础，保持克制留白和真实产品截图。
- 技术边界：官网只承载公开信息，不包含 FileBox App 私有源码。
