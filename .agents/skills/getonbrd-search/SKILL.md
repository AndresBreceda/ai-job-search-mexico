---
name: getonbrd-search
version: 1.0.0
description: >
  Use this skill to search live tech, software, data, AI, product, and engineering job listings
  in Mexico, Latin America, and globally remote via Get on Board (getonbrd.com). Returns rich
  job metadata including salary ranges, remote modality, requirements, and benefits.
  Trigger phrases: getonbrd, get on board, empleos tech mexico, empleos remotos mexico,
  buscar trabajo en getonbrd, tech jobs latin america.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/getonbrd-search/cli/src/cli.ts *), Bash(node .agents/skills/getonbrd-search/cli/src/cli.ts *)
---

# Get on Board Search Skill

Search live job listings from **[Get on Board](https://www.getonbrd.com)** — the leading tech and digital job board for Mexico, Latin America, and remote international opportunities. No authentication, no API key required, zero external dependencies (runs with `bun` or `node`).

## When to use this skill

- Search for software engineering, AI/ML, data science, product, cybersecurity, and tech jobs.
- Filter by query keywords (e.g. `python`, `data engineer`, `machine learning`).
- Filter by country (`Mexico`, `Chile`, `Colombia`, `Argentina`, `Remote`).
- Filter by workplace modality (`remote`, `hybrid`, `onsite`).

## Commands

### Search job listings

```bash
bun run .agents/skills/getonbrd-search/cli/src/cli.ts search -q "<keywords>" [flags]
# Or with node:
node .agents/skills/getonbrd-search/cli/src/cli.ts search -q "<keywords>" [flags]
```

Flags:
- `--query <text>` / `-q <text>` — keyword search (title, skill, role).
- `--country <country>` / `-c <country>` — filter by country, e.g. `Mexico` or `Remote`.
- `--remote <bool>` — `true` for fully remote jobs.
- `--page <n>` — page number (1-indexed, default 1).
- `--limit <n>` / `-n <n>` — limit results emitted (default 20).
- `--format json|table|plain` — output format (default `json`).

### Fetch job detail

```bash
bun run .agents/skills/getonbrd-search/cli/src/cli.ts detail <id|url> [--format json|plain]
# Or with node:
node .agents/skills/getonbrd-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

## Examples

```bash
# Python jobs in Mexico or remote
bun run .agents/skills/getonbrd-search/cli/src/cli.ts search -q "python" -c "Mexico" --format table

# Data Science jobs fully remote
bun run .agents/skills/getonbrd-search/cli/src/cli.ts search -q "data science" --remote true --format table
```
