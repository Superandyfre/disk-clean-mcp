#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "path";
import {
    walk,
    topExtensions,
    topDirectories,
    topFiles,
    staleFiles,
    duplicateGroups,
    bytesToHuman
} from "./scan.js";

const scanSummarySchema = z.object({
    rootPath: z.string(),
    maxDepth: z.number().int().min(0).max(50).optional().describe("Maximum depth to descend (default 10)"),
    followSymlinks: z.boolean().optional().describe("Whether to follow symlinks (default false)"),
    ignoreGlobs: z.array(z.string()).optional().describe("Glob patterns to ignore"),
    includeGlobs: z.array(z.string()).optional().describe("Glob patterns to include; if set, only matches are scanned"),
    maxFiles: z.number().int().min(1).max(200000).optional().describe("Limit files recorded for reports (default 50000)")
});

const byTypeSchema = z.object({
    rootPath: z.string(),
    limit: z.number().int().min(1).max(100).optional(),
    maxDepth: z.number().int().min(0).max(50).optional(),
    ignoreGlobs: z.array(z.string()).optional(),
    includeGlobs: z.array(z.string()).optional(),
    maxFiles: z.number().int().min(1).max(200000).optional()
});

const topDirsSchema = z.object({
    rootPath: z.string(),
    limit: z.number().int().min(1).max(100).optional(),
    maxDepth: z.number().int().min(0).max(50).optional(),
    ignoreGlobs: z.array(z.string()).optional(),
    includeGlobs: z.array(z.string()).optional(),
    maxFiles: z.number().int().min(1).max(200000).optional()
});

const topFilesSchema = z.object({
    rootPath: z.string(),
    limit: z.number().int().min(1).max(200).optional(),
    minSizeMB: z.number().nonnegative().optional(),
    olderThanDays: z.number().positive().optional(),
    includeGlobs: z.array(z.string()).optional(),
    excludeGlobs: z.array(z.string()).optional(),
    maxDepth: z.number().int().min(0).max(50).optional(),
    ignoreGlobs: z.array(z.string()).optional(),
    maxFiles: z.number().int().min(1).max(200000).optional()
});

const staleSchema = z.object({
    rootPath: z.string(),
    limit: z.number().int().min(1).max(200).optional(),
    minSizeMB: z.number().nonnegative().optional(),
    olderThanDays: z.number().positive().optional(),
    maxDepth: z.number().int().min(0).max(50).optional(),
    ignoreGlobs: z.array(z.string()).optional(),
    includeGlobs: z.array(z.string()).optional(),
    maxFiles: z.number().int().min(1).max(200000).optional()
});

const dupSchema = z.object({
    rootPath: z.string(),
    limit: z.number().int().min(1).max(50).optional(),
    maxDepth: z.number().int().min(0).max(50).optional(),
    ignoreGlobs: z.array(z.string()).optional(),
    includeGlobs: z.array(z.string()).optional(),
    maxFiles: z.number().int().min(1).max(50000).optional()
});

const mcp = new McpServer({ name: "disk-clean-mcp", version: "0.1.0" });

async function runWalk(args: {
    rootPath: string;
    maxDepth?: number;
    followSymlinks?: boolean;
    ignoreGlobs?: string[];
    includeGlobs?: string[];
    maxFiles?: number;
}) {
    const res = await walk({
        rootPath: args.rootPath,
        maxDepth: args.maxDepth,
        followSymlinks: args.followSymlinks,
        ignoreGlobs: args.ignoreGlobs,
        includeGlobs: args.includeGlobs,
        maxFiles: args.maxFiles
    });
    return res;
}

mcp.registerTool(
    "scan_summary",
    {
        description: "Scan a directory (read-only) to summarize total size, files, dirs. Supports ignore globs and depth limits.",
        inputSchema: scanSummarySchema
    },
    async (input: z.infer<typeof scanSummarySchema>) => {
        const result = await runWalk(input);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            root: path.resolve(input.rootPath),
                            totalBytes: result.totalSize,
                            totalHuman: bytesToHuman(result.totalSize),
                            files: result.fileCount,
                            dirs: result.dirCount,
                            recordedFiles: result.files.length,
                            truncated: result.truncated,
                            note: "Read-only scan; no deletions performed"
                        },
                        null,
                        2
                    )
                }
            ]
        };
    }
);

mcp.registerTool(
    "by_type",
    {
        description: "Top file extensions by total size.",
        inputSchema: byTypeSchema
    },
    async (input: z.infer<typeof byTypeSchema>) => {
        const result = await runWalk(input);
        const rows = topExtensions(result.files, input.limit ?? 10);
        return { content: [{ type: "text", text: JSON.stringify({ truncated: result.truncated, rows }, null, 2) }] };
    }
);

mcp.registerTool(
    "top_dirs",
    {
        description: "Heaviest directories under root (by aggregate file size).",
        inputSchema: topDirsSchema
    },
    async (input: z.infer<typeof topDirsSchema>) => {
        const result = await runWalk(input);
        const rows = topDirectories(result.files, input.rootPath, input.limit ?? 10);
        return { content: [{ type: "text", text: JSON.stringify({ truncated: result.truncated, rows }, null, 2) }] };
    }
);

mcp.registerTool(
    "top_files",
    {
        description: "Largest files with optional filters (size, age, glob include/exclude).",
        inputSchema: topFilesSchema
    },
    async (input: z.infer<typeof topFilesSchema>) => {
        const result = await runWalk(input);
        const olderThanMs = input.olderThanDays ? Date.now() - input.olderThanDays * 24 * 60 * 60 * 1000 : undefined;
        const minBytes = input.minSizeMB ? input.minSizeMB * 1024 * 1024 : undefined;
        const rows = topFiles(result.files, {
            limit: input.limit ?? 20,
            minBytes,
            olderThanMs,
            includeGlobs: input.includeGlobs,
            excludeGlobs: input.excludeGlobs
        });
        return { content: [{ type: "text", text: JSON.stringify({ truncated: result.truncated, rows }, null, 2) }] };
    }
);

mcp.registerTool(
    "stale_candidates",
    {
        description: "Large and old files (read-only suggestions).",
        inputSchema: staleSchema
    },
    async (input: z.infer<typeof staleSchema>) => {
        const result = await runWalk(input);
        const olderThanMs = input.olderThanDays ? Date.now() - input.olderThanDays * 24 * 60 * 60 * 1000 : undefined;
        const minBytes = input.minSizeMB ? input.minSizeMB * 1024 * 1024 : undefined;
        const rows = staleFiles(result.files, { limit: input.limit ?? 50, minBytes, olderThanMs });
        return { content: [{ type: "text", text: JSON.stringify({ truncated: result.truncated, rows }, null, 2) }] };
    }
);

mcp.registerTool(
    "duplicate_candidates",
    {
        description: "Groups of files with identical size and content hash (read-only).",
        inputSchema: dupSchema
    },
    async (input: z.infer<typeof dupSchema>) => {
        const result = await runWalk(input);
        const rows = await duplicateGroups(result.files, input.limit ?? 10);
        return { content: [{ type: "text", text: JSON.stringify({ truncated: result.truncated, rows }, null, 2) }] };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    transport.onerror = (err: Error) => {
        console.error("[disk-clean-mcp] transport error", err);
    };
    await mcp.connect(transport);
    console.error("[disk-clean-mcp] ready");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
