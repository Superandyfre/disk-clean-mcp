import { createHash } from "crypto";
import { createReadStream } from "fs";
import { Dirent, Stats, promises as fs } from "fs";
import path from "path";
import micromatch from "micromatch";

export interface ScanOptions {
    rootPath: string;
    maxDepth?: number;
    followSymlinks?: boolean;
    ignoreGlobs?: string[];
    includeGlobs?: string[];
    maxFiles?: number;
}

export interface FileRecord {
    fullPath: string;
    relPath: string;
    size: number;
    mtimeMs: number;
}

export interface WalkResult {
    files: FileRecord[];
    totalSize: number;
    fileCount: number;
    dirCount: number;
    truncated: boolean;
}

const DEFAULT_IGNORES = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**", "**/.cache/**"];

const toPosix = (p: string) => p.replace(/\\/g, "/");

function shouldSkip(relPath: string, includeGlobs?: string[], ignoreGlobs?: string[]): boolean {
    const posixPath = toPosix(relPath) || ".";
    const ignoreList = [...DEFAULT_IGNORES, ...(ignoreGlobs ?? [])];
    if (micromatch.some(posixPath, ignoreList, { dot: true })) return true;
    if (includeGlobs && includeGlobs.length > 0) {
        return !micromatch.some(posixPath, includeGlobs, { dot: true });
    }
    return false;
}

async function statEntry(fullPath: string, followSymlinks: boolean): Promise<Stats | null> {
    try {
        return followSymlinks ? await fs.stat(fullPath) : await fs.lstat(fullPath);
    } catch (err) {
        return null;
    }
}

export async function walk(options: ScanOptions): Promise<WalkResult> {
    const maxDepth = options.maxDepth ?? 10;
    const maxFiles = options.maxFiles ?? 50000;
    const files: FileRecord[] = [];
    let totalSize = 0;
    let fileCount = 0;
    let dirCount = 0;
    let truncated = false;

    const root = path.resolve(options.rootPath);
    const queue: Array<{ dir: string; depth: number }> = [{ dir: root, depth: 0 }];

    while (queue.length > 0) {
        const { dir, depth } = queue.shift()!;
        let entries: Dirent[];
        try {
            entries = await fs.readdir(dir, { withFileTypes: true });
            dirCount += 1;
        } catch (err) {
            continue;
        }

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relPath = path.relative(root, fullPath) || entry.name;

            if (shouldSkip(relPath, options.includeGlobs, options.ignoreGlobs)) {
                continue;
            }

            const stats = await statEntry(fullPath, options.followSymlinks ?? false);
            if (!stats) continue;

            if (stats.isDirectory()) {
                if (depth < maxDepth) {
                    queue.push({ dir: fullPath, depth: depth + 1 });
                }
                continue;
            }

            if (stats.isFile()) {
                fileCount += 1;
                totalSize += stats.size;
                if (files.length < maxFiles) {
                    files.push({ fullPath, relPath, size: stats.size, mtimeMs: stats.mtimeMs });
                } else {
                    truncated = true;
                }
            }
        }
    }

    return { files, totalSize, fileCount, dirCount, truncated };
}

export function topExtensions(files: FileRecord[], limit = 10) {
    const byExt = new Map<string, { size: number; count: number }>();
    for (const file of files) {
        const ext = path.extname(file.fullPath).toLowerCase() || "<no-ext>";
        const entry = byExt.get(ext) ?? { size: 0, count: 0 };
        entry.size += file.size;
        entry.count += 1;
        byExt.set(ext, entry);
    }
    return [...byExt.entries()]
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, limit)
        .map(([ext, v]) => ({ ext, totalBytes: v.size, count: v.count }));
}

export function topFiles(files: FileRecord[], options: { limit?: number; minBytes?: number; olderThanMs?: number; includeGlobs?: string[]; excludeGlobs?: string[] } = {}) {
    const limit = options.limit ?? 20;
    const filtered = files.filter((file) => {
        if (options.minBytes !== undefined && file.size < options.minBytes) return false;
        if (options.olderThanMs !== undefined && file.mtimeMs > options.olderThanMs) return false;
        const posixPath = toPosix(file.relPath);
        if (options.excludeGlobs && micromatch.some(posixPath, options.excludeGlobs, { dot: true })) return false;
        if (options.includeGlobs && options.includeGlobs.length > 0 && !micromatch.some(posixPath, options.includeGlobs, { dot: true })) return false;
        return true;
    });
    return filtered
        .sort((a, b) => b.size - a.size)
        .slice(0, limit)
        .map((f) => ({ relPath: f.relPath, bytes: f.size, mtimeMs: f.mtimeMs }));
}

export function topDirectories(files: FileRecord[], rootPath: string, limit = 10) {
    const sizeByDir = new Map<string, number>();
    for (const file of files) {
        const dir = path.dirname(file.relPath) || ".";
        const parts = dir === "." ? [] : dir.split(path.sep);
        let current = "";
        for (const part of parts) {
            current = current ? path.join(current, part) : part;
            sizeByDir.set(current, (sizeByDir.get(current) ?? 0) + file.size);
        }
    }
    return [...sizeByDir.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([relDir, bytes]) => ({ relDir, bytes }));
}

export function staleFiles(files: FileRecord[], options: { minBytes?: number; olderThanMs?: number; limit?: number }) {
    const limit = options.limit ?? 50;
    const filtered = files.filter((f) => {
        if (options.minBytes !== undefined && f.size < options.minBytes) return false;
        if (options.olderThanMs !== undefined && f.mtimeMs > options.olderThanMs) return false;
        return true;
    });
    return filtered
        .sort((a, b) => b.size - a.size)
        .slice(0, limit)
        .map((f) => ({ relPath: f.relPath, bytes: f.size, mtimeMs: f.mtimeMs }));
}

async function hashFile(fullPath: string): Promise<string | null> {
    return new Promise((resolve) => {
        const hash = createHash("sha256");
        const stream = createReadStream(fullPath);
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", () => resolve(null));
    });
}

export async function duplicateGroups(files: FileRecord[], limit = 10) {
    const bySize = new Map<number, FileRecord[]>();
    for (const file of files) {
        const list = bySize.get(file.size) ?? [];
        list.push(file);
        bySize.set(file.size, list);
    }
    const candidates = [...bySize.values()].filter((g) => g.length > 1);
    const groups: Array<{ hash: string; size: number; files: Array<{ relPath: string; mtimeMs: number }> }> = [];

    for (const group of candidates) {
        const byHash = new Map<string, FileRecord[]>();
        for (const file of group) {
            const hash = await hashFile(file.fullPath);
            if (!hash) continue;
            const arr = byHash.get(hash) ?? [];
            arr.push(file);
            byHash.set(hash, arr);
        }
        for (const [hash, dupFiles] of byHash.entries()) {
            if (dupFiles.length < 2) continue;
            groups.push({
                hash,
                size: dupFiles[0].size,
                files: dupFiles.map((f) => ({ relPath: f.relPath, mtimeMs: f.mtimeMs }))
            });
            if (groups.length >= limit) return groups;
        }
        if (groups.length >= limit) break;
    }
    return groups;
}

export const bytesToHuman = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let val = bytes;
    let idx = 0;
    while (val >= 1024 && idx < units.length - 1) {
        val /= 1024;
        idx += 1;
    }
    return `${val.toFixed(val >= 10 ? 1 : 2)} ${units[idx]}`;
};
