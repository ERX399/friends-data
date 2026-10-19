<div align="center">

![:name](https://count.getloli.com/@friends-data?name=friends-data&theme=minecraft&padding=6&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

# friends-and-sponsors

_✨ 友链与赞助数据源 · 社区 PR 自动审核 ✨_

[![GitHub](https://img.shields.io/badge/作者-ERX399-blue)](https://github.com/ERX399)

</div>

Xia 的友链和赞助数据源。

## 目录结构

```
data/friends/        — 友链条目（每文件一条）
data/sponsors/       — 赞助条目（每文件一条）
scripts/build.js     — 构建脚本
wrangler.jsonc       — Cloudflare Pages 配置
```

## 构建

`node scripts/build.js` 会扫描 `data/` 下所有 JSON 文件，校验并排序后输出 `dist/friends.json` 和 `dist/sponsors.json`。

## 部署

连接 Cloudflare Pages，配置：
- 构建命令：`node scripts/build.js`
- 输出目录：`dist`

访问 `https://<project>.pages.dev/friends.json` 和 `https://<project>.pages.dev/sponsors.json`。

## 数据格式

### 友链

```json
{
  "name": "站点名",
  "avatar": "头像 URL 或 null",
  "description": "简介（可选）",
  "url": "站点 URL",
  "vip": true,
  "backlink": "友链页 URL（可选）"
}
```

### 赞助

```json
{
  "name": "赞助者名",
  "avatar": "头像 URL 或 null",
  "date": "2025-08-02",
  "amount": "100 ￥"
}
```
