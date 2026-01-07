# MCP Hub Submission Guide

## Automated Publishing (via GitHub Action)

When you create a Release, GitHub Action will automatically:
1. Validate `server.json` structure
2. Verify mcpb asset is uploaded
3. Generate submission package
4. Print submission info for manual entry into MCP Hub

## Manual Submission Steps

### Step 1: Verify Release
Check https://github.com/Superandyfre/disk-clean-mcp/releases/tag/v0.1.2

Confirm:
- ? Tag: v0.1.2
- ? mcpb file uploaded
- ? Release notes present

### Step 2: Prepare Submission

Copy the following configuration:

```json
{
  "name": "io.github.superandyfre/disk-clean-mcp",
  "packages": [
    {
      "registry_type": "mcpb",
      "identifier": "https://github.com/Superandyfre/disk-clean-mcp/releases/download/v0.1.2/disk-clean-mcp.mcpb",
      "file_sha256": "AC9C66F15198FAD9E41E83436FF9A926C923060BCF80BF37B56F8A7DEB5A1D5F"
    }
  ]
}
```

### Step 3: Submit to MCP Hub

Visit the MCP Hub submission portal and provide:

- **Project Name**: Disk Clean MCP
- **Description**: Read-only local disk usage analysis MCP server. Analyzes disk usage by file size, type, recency, and duplicates.
- **Repository**: https://github.com/Superandyfre/disk-clean-mcp
- **NPM Package**: https://www.npmjs.com/package/disk-clean-mcp
- **Command**: `disk-clean-mcp`
- **Installation**: `npm install -g disk-clean-mcp` or `npx disk-clean-mcp`
- **Server Configuration**: (copy content from server.json above)
- **License**: MIT
- **Author**: Superandyfre

### Step 4: Verify Installation

After approval, test installation:

```bash
npm install -g disk-clean-mcp
disk-clean-mcp --help
```

Or use without installation:

```bash
npx disk-clean-mcp
```

## Tools Available

1. **scan_summary** - Summarize directory size, file count, directory count
2. **by_type** - File extensions ranked by total size
3. **top_dirs** - Heaviest subdirectories
4. **top_files** - Largest files with filters
5. **stale_candidates** - Large and old files for cleanup
6. **duplicate_candidates** - Files with identical size and hash

## Support

- Issues: https://github.com/Superandyfre/disk-clean-mcp/issues
- Discussions: https://github.com/Superandyfre/disk-clean-mcp/discussions
