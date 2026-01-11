# Sub-Web-Modify

<div align="center">
  <h3>🚀 全网最美观的订阅转换前端界面</h3>
  <p>基于 Vue.js 开发的现代化订阅转换 Web 前端</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)](https://nodejs.org/)
  [![Vue Version](https://img.shields.io/badge/vue-2.7.16-green)](https://vuejs.org/)
</div>

## 📖 项目简介

Sub-Web-Modify 是基于 [CareyWang/sub-web](https://github.com/CareyWang/sub-web) 项目的增强版本，专为订阅转换服务设计的现代化前端界面。感谢原作者 [youshandefeiyang](https://github.com/youshandefeiyang) 的出色工作，本项目在其基础上进行了进一步优化。

### 🌟 主要特性

- 🎨 **现代化界面设计** - 全新重制的 CSS 样式，更加美观易用
- 🌓 **智能主题切换** - 支持亮色/暗色主题，可自动跟随系统设置，并支持手动切换
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- 🔗 **多种订阅格式支持** - 支持 Clash、Surge、V2Ray、Quantumult X、Sing-Box 等主流客户端
- 🛠️ **高级功能** - 节点筛选、重命名、配置定制等高级选项
- ⚙️ **动态表单** - “远程配置”等选项会根据所选客户端类型自动显示或隐藏，界面更清爽
- 🧠 **智能配置策略** - 自动根据客户端类型应用最佳实践设置（如自动开启 Clash 新字段名、UDP 等），并屏蔽不适用选项
- 🧩 **兼容多种短链服务** - 支持不同 API 格式的短链服务，包括 Cloudflare Pages 自建短链
- 🛡️ **Cloudflare 代理** - 内置代理功能，可智能解决部分订阅源被墙无法访问、解析的问题（如托管在CloudFlare等第三方平台上的域名）
- 📝 **自定义短链后缀** - 支持指定短链接后缀，并提供智能的冲突检测和覆盖确认
- 📜 **后缀历史记录** - 自动记录最近使用的自定义短链后缀，方便快速复用
- 🔄 **智能反查功能** - 支持通过短链后缀反查原始订阅配置，自动解析并填充所有参数，方便二次编辑
- 📥 **URL 解析导入** - 支持从已有的长/短订阅链接中解析参数并填入页面，快速还原配置

## 🖥️ 界面预览

![效果预览](https://raw.githubusercontent.com/youshandefeiyang/webcdn/main/sub-web-modify.GIF)

## 🚀 快速部署

### 方式一：Cloudflare Pages 部署（推荐）

1. **Fork 本仓库** 到你的 GitHub 账户。
2. **修改配置文件**：
   - **（必须）** 编辑 `.env` 文件，设置你的默认后端地址、短链服务等。
     ```env
     # 默认后端地址
     VUE_APP_SUBCONVERTER_DEFAULT_BACKEND=https://your-backend-url.com
     
     # 默认的短链接服务地址（注意：必须包含 /short 后缀）
     VUE_APP_MYURLS_DEFAULT_BACKEND=https://your-short-url-service.com/short
     ```
   - **（可选）** 编辑 `src/views/Subconverter.vue`，在 `options` 中添加或修改内置的后端、短链、远程配置列表。
3. **连接到 Cloudflare Pages**：
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
   - 进入 **Workers & Pages** → **创建应用程序** → **Pages** → **连接到 Git**。
   - 选择你 Fork 的仓库。
4. **配置构建设置**：
   - **框架预设**：`Vue`
   - **构建命令**：`npm run build`
   - **构建输出目录**：`/dist`
5. **部署完成** - 点击“保存并部署”。之后每次向 `master` 分支推送代码都会自动更新。

### 方式二：使用 Docker 部署

本项目已配置好 GitHub Actions，当你向 `master` 分支推送代码时，会自动构建一个 Docker 镜像并推送到 `ghcr.io`。

1. **Fork 本仓库** 并进行你想要的修改。
2. **推送到 `master` 分支**，等待 Actions 完成。
3. **部署镜像**：
   
   **使用 Docker CLI:**
   ```sh
   # 将 <your-github-username> 替换为你的 GitHub 用户名
   docker run -d --name sub-web --restart=always -p 8080:80 ghcr.io/<your-github-username>/sub-web-modify:latest
   ```

   **使用 Docker Compose (推荐):**
   创建一个 `docker-compose.yml` 文件：
   ```yaml
   version: '3'
   services:
     sub-web:
       image: ghcr.io/<your-github-username>/sub-web-modify:latest
       container_name: sub-web
       restart: always
       ports:
         - "8080:80"
   ```
   然后运行：
   ```sh
   docker compose up -d
   ```
   现在，你可以通过 `http://你的服务器IP:8080` 访问。

## 🔧 配置说明

### 1. `.env` 文件
这是配置默认值的核心文件。

```env
# 项目地址，用于界面上的 GitHub 图标跳转
VUE_APP_PROJECT = "https://github.com/whua898/sub-web-modify"

# 默认的订阅转换后端地址
VUE_APP_SUBCONVERTER_DEFAULT_BACKEND=https://your-backend-url.com

# 默认的短链接服务地址（注意：必须包含 /short 后缀）
VUE_APP_MYURLS_DEFAULT_BACKEND=https://your-short-url-service.com/short

# 其他链接...
```

### 2. `src/views/Subconverter.vue`
如果你想修改下拉菜单中的**内置选项列表**，请编辑此文件中的 `options` 对象。

## 💡 常见问题

### Q: 订阅链接转换后没有节点？
A: 这可能是因为订阅源被墙，或者 SubConverter 后端无法访问该订阅源。本项目内置了 **智能 Cloudflare 代理** 功能，会自动检测并代理访问部分被墙的订阅源（如 GitHub、Cloudflare Pages 等）。如果仍然无法下载，可能是订阅源本身已失效或屏蔽了代理服务器。

### Q: 短链接生成失败？
A: 请检查 `.env` 文件中的 `VUE_APP_MYURLS_DEFAULT_BACKEND` 是否配置正确，必须包含 `/short` 后缀。

### Q: 反查功能如何使用？
A: 在“定制后缀”输入框中输入您之前生成的短链后缀（例如 `my-config`），然后点击右侧的“反查”按钮。系统会自动从短链服务获取原始配置，并填充到界面中，方便您进行修改和更新。

## 📋 支持的客户端

| 客户端 | 平台 | 状态 |
|--------|------|------|
| Clash | Windows/macOS/Linux | ✅ |
| Surge | iOS/macOS | ✅ |
| Quantumult X | iOS | ✅ |
| V2Ray | 全平台 | ✅ |
| Sing-Box | 全平台 | ✅ |

## 📚 短链服务 API 说明

本项目适配了 `short.wh8.xx.kg` 的短链 API，支持 JSON 格式交互、冲突检测与覆盖、以及反查功能。

### 1. 创建短链 `POST /short`
用于创建或获取短链接。兼容 v1.mk (MyUrls) 协议。

- **请求方式**: JSON (推荐)
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "url": "https://example.com/your-long-url",
    "slug": "custom-name", // (可选) 自定义短链名
    "overwrite": false     // (可选) 是否覆盖已存在的短链
  }
  ```
- **响应**:
  - 成功: `{ "Code": 1, "ShortUrl": "..." }`
  - 冲突 (409): `{ "Code": 0, "Message": "Slug already exists", "existingUrl": "..." }`

### 2. 反查长链 `POST /query`
用于通过 slug 查询对应的原始长链接。

- **Content-Type**: `application/json`
- **Body**: `{ "slug": "custom-name" }`
- **响应**:
  - 成功: `{ "Code": 1, "Slug": "...", "LongUrl": "...", "CreateTime": "..." }`
  - 未找到: `{ "Code": 0, "Message": "Slug not found" }`

### 3. 获取自定义列表 `GET /list`
获取所有自定义生成的短链列表。

- **响应**:
  ```json
  {
    "Code": 1,
    "Data": [
      { "slug": "custom1", "url": "..." },
      { "slug": "custom2", "url": "..." }
    ]
  }
  ```

## 📂 项目结构说明

本项目包含前端界面与后端 Serverless Functions (Cloudflare Pages)。

### 前端 (Vue.js)
- `src/views/Subconverter.vue`: 核心页面，包含订阅转换表单、短链生成逻辑、反查逻辑等。
- `src/plugins/base64.js`: Base64 编码/解码工具。
- `.env`: 环境变量配置文件。

### 后端 (Cloudflare Pages Functions)
位于 `functions/` 目录下：

- `functions/short.js`: 处理短链生成 (`/short`)，支持 JSON 和 FormData，包含覆盖逻辑。
- `functions/query.js`: 处理短链反查 (`/query`)。
- `functions/list.js`: 获取自定义短链列表 (`/list`)。
- `functions/[id].js`: 处理短链跳转重定向。
- `functions/api/proxy.js`: 通用 CORS 代理，用于解决部分订阅源跨域或被墙问题。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 📞 支持与反馈

- 🐛 **Bug 报告**：[Issues](https://github.com/whua898/sub-web-modify/issues)
- 💡 **功能建议**：[Issues](https://github.com/whua898/sub-web-modify/issues)

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 特别感谢原作者 [youshandefeiyang](https://github.com/youshandefeiyang) 的杰出贡献
- 感谢 [CareyWang/sub-web](https://github.com/CareyWang/sub-web) 提供的原始项目基础
- 感谢所有贡献者的辛勤付出
