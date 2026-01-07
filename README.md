# Disk Clean MCP

A Model Context Protocol server that analyzes local disk usage (read-only) and suggests cleanup targets by size, type, recency, and duplicates.

## Features
- Scan directories for totals (size, files, directories) with ignore globs and depth limits.
- Breakdown by file extension and largest directories/files.
- Stale file suggestions (large and old).
- Duplicate candidates via size + hash (read-only).
- Configurable limits to avoid huge walks.

## 环境要求
- Node.js >= 18
- 只读扫描，不会删除或移动文件

## 安装与运行
### 已发布包（推荐方式）
1) 安装或直接运行
   ```bash
   npm install -g disk-clean-mcp
   # 或
   npx disk-clean-mcp
   ```
2) MCP 配置示例（Claude Desktop 等）
   ```json
   {
     "mcpServers": {
       "disk-clean": {
         "command": "disk-clean-mcp",
         "args": [],
         "cwd": "/path/to/workdir"
       }
     }
   }
   ```

### 本地源码开发/运行
```bash
npm install
npm run build
npm start          # 等价于 node dist/index.js
# 开发模式
npm run dev
```

## 发布 / 验证清单
- npm run build 确认编译通过
- 确认 Node 版本 >= 18
- 更新版本号：npm version patch|minor|major
- npm publish 发布到 npm（需要先登陆 npm）
- 更新 README/CHANGELOG 如有改动
- 将 package.json 中的 repository / bugs / homepage 替换为实际仓库地址

## Tools
- `scan_summary` – total size/files/dirs, optional depth and ignore globs.
- `by_type` – top extensions by total size.
- `top_dirs` – heaviest subdirectories.
- `top_files` – largest files with filters (min size, age, glob include/exclude).
- `stale_candidates` – large and old files.
- `duplicate_candidates` – groups of files with identical sizes and hashes (read-only).

## Notes
- Read-only: no delete/move operations.
- Defaults skip common noisy folders: `node_modules`, `.git`, `dist`, `build`, `.cache`.
- Use `ignoreGlobs` / `includeGlobs` to refine scope.
- Use `maxFiles`/`maxDepth` to control workload.
- License: MIT
