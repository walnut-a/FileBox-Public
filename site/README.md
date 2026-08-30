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

## 稳定版更新清单

[`src/data/stable-release.json`](./src/data/stable-release.json) 是官网展示版本和 FileBox 客户端更新检查的唯一版本源。每次正式发版后，根据已经验证的 GitHub Release 和 DMG 更新这份文件，至少核对：

- `version`、`build` 和最低系统版本
- Release、下载页和 DMG 地址
- DMG 字节大小和 SHA-256
- 中英文更新摘要

`npm run build` 会把它原样复制到：

```text
dist/updates/stable.json
```

Cloudflare Pages 通过 [`public/_headers`](./public/_headers) 为这个地址设置 JSON 类型和重新验证缓存策略。部署前执行：

```bash
npm test
npm run build
jq . dist/updates/stable.json
```

部署后验证生产地址返回 JSON，而不是单页应用 fallback：

```bash
curl -fsSI https://getfilebox.app/updates/stable.json
curl -fsS https://getfilebox.app/updates/stable.json | jq .
```

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

## 流量来源分析接入说明

本站只接入 Cloudflare Web Analytics，不接入 Google Analytics、Umami 或 Plausible。

### Cloudflare Web Analytics

`getfilebox.app` 当前已在 Cloudflare Web Analytics 开启自动设置，线上自定义域名会由 Cloudflare 自动注入官方 beacon script，不需要在每次构建产物里写入 token。

代码侧也预留了手动 JS snippet 方案。如果以后在 Cloudflare 后台改为手动安装，或希望 Pages 构建产物自带官方 beacon script，可以把 token 配成环境变量。

Cloudflare Web Analytics token 在 Cloudflare Dashboard 的 Web Analytics 里创建或管理站点时获取：

1. 进入 Cloudflare Dashboard → Web Analytics。
2. 添加 `getfilebox.app`，或打开已有站点的 Manage site。
3. 复制官方 JS snippet 里的 `data-cf-beacon` token。
4. 如需手动注入，在 Cloudflare Pages 项目 `getfilebox-app` 的环境变量中配置：

```bash
CLOUDFLARE_WEB_ANALYTICS_TOKEN=你的 Cloudflare Web Analytics token
```

本项目是 Vite + React 单页应用，入口在 `site/index.html`。如果配置了 `CLOUDFLARE_WEB_ANALYTICS_TOKEN`，构建时会通过 `site/vite.config.ts` 把官方 beacon script 注入全局 `<head>`，不会在每个页面重复插入。Cloudflare Web Analytics 会自动追踪基于 History API 的 SPA 路由变化；当前站点没有额外路由埋点。

本地验证可以临时带 token 构建：

```bash
CLOUDFLARE_WEB_ANALYTICS_TOKEN=test-token npm run build
rg "static.cloudflareinsights.com|test-token" dist/index.html
```

### Google Search Console

Search Console 推荐使用 Domain property + DNS TXT 验证，不依赖网站代码，也不会因为前端改版丢失验证。

操作建议：

1. 在 Google Search Console 添加 Domain property：`getfilebox.app`。
2. 选择 DNS TXT 验证。
3. 把 Google 提供的 `google-site-verification=...` TXT 记录添加到 Cloudflare DNS。
4. 等 DNS 生效后回到 Search Console 点击 Verify。

只有在 DNS TXT 不可用时，才考虑 HTML meta tag 验证；如果使用 meta tag，应加到 `site/index.html` 的全局 `<head>`。

### UTM 分享规范

以后对外发链接时建议带 UTM，方便在 Cloudflare Web Analytics 里按来源判断访问大概从哪里来。

示例：

```text
https://getfilebox.app/?utm_source=x&utm_medium=social&utm_campaign=site_share
https://getfilebox.app/?utm_source=github&utm_medium=profile&utm_campaign=homepage
https://getfilebox.app/?utm_source=wechat&utm_medium=share&utm_campaign=article
```

## 设计方向

- 目标用户：需要快速访问常用目录、整理下载文件、关注文件动态，并把路径交给 Agent 的 Mac 用户。
- 品牌感觉：安静、温暖、可靠。
- 视觉方向：以 FileBox 纸盒图标的暖色和 macOS 原生窗口感为基础，保持克制留白和真实产品截图。
- 技术边界：官网只承载公开信息，不包含 FileBox App 私有源码。
