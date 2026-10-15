---
name: mexico-portals-search
version: 1.0.0
description: >
  Search live job listings across Mexico's leading employment portals: OCCMundial, Computrabajo México,
  and Indeed México. Searches across Mexican cities (CDMX, Guadalajara, Monterrey, Querétaro, etc.)
  and remote national roles. Returns structured JSON with job title, company, location, salary in MXN, and URL.
  Trigger phrases: occ, occmundial, computrabajo, indeed mexico, empleos mexico, buscar trabajo en mexico,
  bolsa de trabajo mexico, vacantes mexico.
context: fork
enabled: true
allowed-tools: Bash(python .agents/skills/mexico-portals-search/cli/src/cli.py *), Bash(python3 .agents/skills/mexico-portals-search/cli/src/cli.py *), Bash(node .agents/skills/mexico-portals-search/cli/src/cli.js *)
---

# Mexico Portals Search Skill

Searches live job listings from Mexico's major employment boards:
- **OCCMundial** (`occ.com.mx`) — Mexico's leading professional job board.
- **Computrabajo México** (`mx.computrabajo.com`) — Broad coverage across technical, administrative, and engineering roles.
- **Indeed México** (`mx.indeed.com`) / aggregators.

No API keys required. Operates via standard HTTP requests with Mexico-localized headers.

## When to use this skill

- Search for jobs in Mexican cities: Ciudad de México (CDMX), Guadalajara, Monterrey, Querétaro, Puebla, etc., or Remoto Nacional.
- Search across all sectors: Software, Data, AI, IT, Management, Operations, Engineering.
- Extract salary data published in **Mexican Pesos (MXN)**.

## Commands

### Search job listings

```bash
python .agents/skills/mexico-portals-search/cli/src/cli.py search -q "<keywords>" [flags]
```

Flags:
- `--query <text>` / `-q <text>` — job title, skill, or keywords (e.g. `"desarrollador python"`, `"data engineer"`).
- `--location <text>` / `-l <text>` — city or state in Mexico (e.g. `"Ciudad de México"`, `"Guadalajara"`, `"Remoto"`).
- `--portal <occ|computrabajo|all>` — filter by portal (default `all`).
- `--limit <n>` / `-n <n>` — max results to return (default 20).
- `--format json|table|plain` — output format (default `json`).

### Fetch job details

```bash
python .agents/skills/mexico-portals-search/cli/src/cli.py detail "<url>" [--format json|plain]
```

## Examples

```bash
# Search for Python developer roles in Mexico
python .agents/skills/mexico-portals-search/cli/src/cli.py search -q "desarrollador python" --format table

# Search OCC specifically for Data Science in CDMX
python .agents/skills/mexico-portals-search/cli/src/cli.py search -q "data science" -l "Ciudad de México" --portal occ --format table
```
