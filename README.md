# Disk Clean MCP
mcp-name: io.github.superandyfre/disk-clean-mcp

[![npm version](https://img.shields.io/npm/v/disk-clean-mcp?color=2e7d32)](https://www.npmjs.com/package/disk-clean-mcp)
[![build](https://github.com/Superandyfre/disk-clean-mcp/actions/workflows/build.yml/badge.svg)](https://github.com/Superandyfre/disk-clean-mcp/actions/workflows/build.yml)
[![license](https://img.shields.io/badge/license-MIT-0a0a0a.svg)](https://github.com/Superandyfre/disk-clean-mcp/blob/main/LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-43853d.svg)](https://nodejs.org/en/)

**Available Languages:** [English](#disk-clean-mcp) | [Fran?ais](#fr) | [简体中文](#zh-cn) | [繁體中文](#zh-tw) | [???](#ko) | [日本語](#ja)

---

## English

A Model Context Protocol (MCP) server that analyzes local disk usage in read-only mode and suggests cleanup targets by size, type, recency, and duplicates.

### Features
- **Directory Scanning**: Scan directories to summarize total size, file count, and directory count with configurable depth limits and glob patterns.
- **Extension Analysis**: Breakdown disk usage by file extension to identify the largest file types.
- **Directory Ranking**: List the heaviest subdirectories by aggregate file size.
- **Large File Detection**: Find the largest files with optional filters for size, age, and glob patterns.
- **Stale File Suggestions**: Identify large and old files that may be candidates for cleanup.
- **Duplicate Detection**: Find groups of files with identical sizes and content hashes (read-only).
- **Configurable Limits**: Use `ignoreGlobs`, `includeGlobs`, `maxFiles`, and `maxDepth` to refine scope and control workload.

### Requirements
- Node.js >= 18
- Read-only operation (no delete/move functions)
- Common folders ignored by default: `node_modules`, `.git`, `dist`, `build`, `.cache`

### Installation & Usage
#### Published Package (Recommended)
```bash
npm install -g disk-clean-mcp
# or use directly without installation
npx disk-clean-mcp
```

#### Configuration for Claude Desktop
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

#### Local Development
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
# or dev mode with auto-compilation
npm run dev
```

### Tools
- **scan_summary** – Get total size, file count, directory count with optional depth and ignore globs
- **by_type** – Top file extensions ranked by total size
- **top_dirs** – Heaviest subdirectories by aggregate size
- **top_files** – Largest files with filters (min size, age, glob include/exclude)
- **stale_candidates** – Large and old files (cleanup suggestions)
- **duplicate_candidates** – Groups of files with identical size and content hash (read-only)

### MCP Hub / Claude Submission (EN/中文)
- Status: pending listing; add MCP Hub link after approval.
- Provide when submitting: repo URL, npm install command (`npm install -g disk-clean-mcp` / `npx disk-clean-mcp`), command name (`disk-clean-mcp`), Node >= 18, MIT license, and the tool list above.
- Config snippet (Claude Desktop): see “Configuration for Claude Desktop” JSON above.
- 中文要点：提交时准备仓库链接、npm 安装指令、命令名、Node 版本要求、MIT 许可、工具清单、Claude 配置示例。

### Release Checklist
- [ ] Run `npm run build` to verify compilation
- [ ] Confirm Node.js >= 18
- [ ] Update version: `npm version patch|minor|major`
- [ ] Publish to npm: `npm publish` (requires npm login)
- [ ] Update README and CHANGELOG if applicable
- [ ] Update repository URLs in package.json if needed

### License
MIT – Copyright (c) 2026 Superandyfre

---

<a id="fr"></a>

## Fran?ais

Un serveur Model Context Protocol (MCP) qui analyse l'utilisation du disque local en mode lecture seule et suggère des cibles de nettoyage par taille, type, récence et doublons.

### Fonctionnalités
- **Analyse de répertoires**: Scannez les répertoires pour résumer la taille totale, le nombre de fichiers et répertoires avec limites de profondeur configurables et motifs glob.
- **Analyse par extension**: Décomposez l'utilisation du disque par extension de fichier pour identifier les types de fichiers les plus volumineux.
- **Classement des répertoires**: Listez les sous-répertoires les plus volumineux par taille de fichier agrégée.
- **Détection de fichiers volumineux**: Trouvez les fichiers les plus volumineux avec filtres optionnels par taille, ?ge et motifs glob.
- **Suggestions de fichiers obsolètes**: Identifiez les fichiers volumineux et anciens pour nettoyage potentiel.
- **Détection des doublons**: Trouvez les groupes de fichiers avec tailles et hachages de contenu identiques (lecture seule).
- **Limites configurables**: Utilisez `ignoreGlobs`, `includeGlobs`, `maxFiles` et `maxDepth` pour affiner la portée.

### Configuration requise
- Node.js >= 18
- Opération en lecture seule (pas de fonctions de suppression/déplacement)
- Dossiers ignorés par défaut: `node_modules`, `.git`, `dist`, `build`, `.cache`

### Installation et utilisation
#### Paquet publié (recommandé)
```bash
npm install -g disk-clean-mcp
# ou utiliser directement
npx disk-clean-mcp
```

#### Configuration pour Claude Desktop
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

#### Développement local
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
npm run dev  # mode dev avec recompilation automatique
```

### Outils disponibles
- **scan_summary** – Obtenez la taille totale, le nombre de fichiers et répertoires
- **by_type** – Extensions de fichier classées par taille totale
- **top_dirs** – Sous-répertoires les plus volumineux
- **top_files** – Fichiers les plus volumineux avec filtres
- **stale_candidates** – Fichiers volumineux et anciens
- **duplicate_candidates** – Groupes de fichiers doublons

### Licence
MIT – Copyright (c) 2026 Superandyfre

---

<a id="zh-cn"></a>

## 简体中文

一个 Model Context Protocol (MCP) 服务器，用于分析本地磁盘使用情况（只读模式），并按大小、类型、新旧程度和重复项建议清理目标。

### 功能特性
- **目录扫描**: 扫描目录以汇总总大小、文件数和目录数，支持可配置的深度限制和全局匹配模式。
- **扩展名分析**: 按文件扩展名分解磁盘使用情况，识别最大的文件类型。
- **目录排名**: 按聚合文件大小列出最大的子目录。
- **大文件检测**: 查找最大的文件，支持按大小、年龄和全局模式过滤。
- **陈旧文件建议**: 识别可能需要清理的大型且老旧的文件。
- **重复项检测**: 查找具有相同大小和内容哈希的文件组（只读）。
- **可配置限制**: 使用 `ignoreGlobs`、`includeGlobs`、`maxFiles` 和 `maxDepth` 来调整范围和控制工作负载。

### 系统要求
- Node.js >= 18
- 只读操作（无删除/移动功能）
- 默认忽略的文件夹：`node_modules`、`.git`、`dist`、`build`、`.cache`

### 安装与使用
#### 已发布的包（推荐）
```bash
npm install -g disk-clean-mcp
# 或直接使用
npx disk-clean-mcp
```

#### Claude Desktop 配置示例
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

#### 本地开发
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
npm run dev  # 开发模式，自动编译
```

### 工具列表
- **scan_summary** – 获取总大小、文件数、目录数，支持深度和忽略模式
- **by_type** – 按总大小排列的文件扩展名
- **top_dirs** – 最大的子目录（按聚合大小）
- **top_files** – 最大的文件，支持过滤（大小、年龄、模式）
- **stale_candidates** – 大型且老旧的文件（清理建议）
- **duplicate_candidates** – 重复文件组（相同大小和哈希）

### 发布检查清单
- [ ] 运行 `npm run build` 验证编译
- [ ] 确认 Node.js >= 18
- [ ] 更新版本：`npm version patch|minor|major`
- [ ] 发布到 npm：`npm publish`（需要 npm 登录）
- [ ] 更新 README 和 CHANGELOG（如适用）

### 许可证
MIT – Copyright (c) 2026 Superandyfre

---

<a id="zh-tw"></a>

## 繁體中文

一個 Model Context Protocol (MCP) 伺服器，用於分析本機磁碟使用情況（唯讀模式），並按大小、類型、新舊程度和重複項建議清理目標。

### 功能特性
- **目錄掃描**: 掃描目錄以彙總總大小、檔案數和目錄數，支援可設定的深度限制和通用配對模式。
- **副檔名分析**: 按檔案副檔名分解磁碟使用情況，識別最大的檔案類型。
- **目錄排名**: 按聚合檔案大小列出最大的子目錄。
- **大檔案偵測**: 查找最大的檔案，支援按大小、年齡和通用模式篩選。
- **陳舊檔案建議**: 識別可能需要清理的大型且老舊的檔案。
- **重複項偵測**: 查找具有相同大小和內容雜湊的檔案組（唯讀）。
- **可設定限制**: 使用 `ignoreGlobs`、`includeGlobs`、`maxFiles` 和 `maxDepth` 來調整範圍和控制工作負載。

### 系統需求
- Node.js >= 18
- 唯讀作業（無刪除/移動功能）
- 預設忽略的資料夾：`node_modules`、`.git`、`dist`、`build`、`.cache`

### 安裝與使用
#### 已發佈的套件（推薦）
```bash
npm install -g disk-clean-mcp
# 或直接使用
npx disk-clean-mcp
```

#### Claude Desktop 設定範例
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

#### 本機開發
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
npm run dev  # 開發模式，自動編譯
```

### 工具清單
- **scan_summary** – 取得總大小、檔案數、目錄數，支援深度和忽略模式
- **by_type** – 按總大小排列的檔案副檔名
- **top_dirs** – 最大的子目錄（按聚合大小）
- **top_files** – 最大的檔案，支援篩選（大小、年齡、模式）
- **stale_candidates** – 大型且老舊的檔案（清理建議）
- **duplicate_candidates** – 重複檔案組（相同大小和雜湊）

### 授權
MIT – Copyright (c) 2026 Superandyfre

---

<a id="ko"></a>

## ???

?? ??? ???? ?? ?? ??? ???? ??, ??, ??? ? ?? ???? ?? ??? ???? Model Context Protocol (MCP) ?????.

### ??
- **???? ??**: ????? ???? ? ??, ?? ? ? ???? ?? ????, ?? ??? ?? ?? ? ??? ??? ?????.
- **??? ??**: ?? ????? ??? ???? ???? ?? ? ?? ??? ?????.
- **???? ??**: ?? ?? ???? ?? ? ?? ????? ?????.
- **? ?? ??**: ??, ?? ? ??? ???? ??? ??? ???? ?? ? ??? ????.
- **??? ?? ??**: ?? ??? ? ? ?? ?? ??? ??? ?????.
- **?? ??**: ??? ?? ? ??? ??? ?? ?? ??? ????(?? ??).
- **?? ??? ??**: `ignoreGlobs`, `includeGlobs`, `maxFiles` ? `maxDepth`? ???? ??? ?????.

### ?? ??
- Node.js >= 18
- ?? ?? ??(??/?? ?? ??)
- ????? ???? ??: `node_modules`, `.git`, `dist`, `build`, `.cache`

### ?? ? ??
#### ??? ???(??)
```bash
npm install -g disk-clean-mcp
# ?? ?? ??
npx disk-clean-mcp
```

#### Claude Desktop ?? ?
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

#### ?? ??
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
npm run dev  # ?? ???? ?? ?? ??
```

### ??
- **scan_summary** – ? ??, ?? ?, ???? ? ??
- **by_type** – ? ???? ??? ?? ???
- **top_dirs** – ?? ???? ?? ? ?? ????
- **top_files** – ??? ?? ?? ? ??(??, ??, ??)
- **stale_candidates** – ?? ??? ??(?? ??)
- **duplicate_candidates** – ?? ?? ??(??? ?? ? ??)

### ????
MIT – Copyright (c) 2026 Superandyfre

---

<a id="ja"></a>

## 日本語

ローカルディスクの使用状況を読み取り専用モードで分析し、サイズ、タイプ、最新性、および重複によってクリーンアップ対象を提案するModel Context Protocol（MCP）サーバーです。

### 機能
- **ディレクトリスキャン**: ディレクトリをスキャンして、合計サイズ、ファイル数、ディレクトリ数を要約します。構成可能な深度制限とグロブパターンをサポートします。
- **拡張分析**: ファイル拡張子別にディスク使用量を分解し、最大のファイルタイプを識別します。
- **ディレクトリランキング**: 集計ファイルサイズ別に最大のサブディレクトリを一覧表示します。
- **大きなファイル検出**: サイズ、年齢、グロブパターンでフィルタリング可能な最大のファイルを検索します。
- **古いファイルの提案**: クリーンアップの対象となる可能性がある大きくて古いファイルを識別します。
- **重複検出**: 同じサイズとコンテンツハッシュを持つファイルグループを検索します（読み取り専用）。
- **構成可能な制限**: `ignoreGlobs`、`includeGlobs`、`maxFiles`、`maxDepth`を使用してスコープを調整します。

### 要件
- Node.js >= 18
- 読み取り専用操作（削除/移動機能なし）
- デフォルトで無視されるフォルダ: `node_modules`、`.git`、`dist`、`build`、`.cache`

### インストールと使用
#### 公開パッケージ（推奨）
```bash
npm install -g disk-clean-mcp
# または直接使用
npx disk-clean-mcp
```

#### Claude Desktop設定例
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

#### ローカル開発
```bash
git clone https://github.com/Superandyfre/disk-clean-mcp.git
cd disk-clean-mcp
npm install
npm run build
npm start
npm run dev  # 自動コンパイル付きの開発モード
```

### ツール
- **scan_summary** – 合計サイズ、ファイル数、ディレクトリ数を取得
- **by_type** – 合計サイズ別にソートされたファイル拡張子
- **top_dirs** – 集計サイズ別に最大のサブディレクトリ
- **top_files** – フィルタ付きの最大ファイル（サイズ、年齢、パターン）
- **stale_candidates** – 大きくて古いファイル（クリーンアップ提案）
- **duplicate_candidates** – 重複ファイルグループ（同じサイズとハッシュ）

### ライセンス
MIT – Copyright (c) 2026 Superandyfre
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
