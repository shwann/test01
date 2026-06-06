# Task2Code Startup Plan

## Status
- Status: `resolved`
- Source: `.task2code/startup_plan.md`
- Summary: Startup plan resolved.

## Metadata
- Last verified commit: `9347082e3cd8ba2a7f0d989d3ea44dc84aabad0d`
- Last verified at: `2026-06-06T13:50:03.357762Z`
- Last smoke status: `passed`
- Stale reasons: `none`

## Source Files
- `.task2code/startup_plan.md`: `found`
- `.enterprise/project.json`: `missing`
- `package.json`: `found`
- `server.js`: `found`
- `Makefile`: `missing`
- `docker-compose.yml`: `missing`
- `docker-compose.yaml`: `missing`
- `compose.yml`: `missing`
- `compose.yaml`: `missing`
- `README.md`: `found`

## Start Commands
### web
- Command: `npm start`
- CWD: `.`
- URL: `http://127.0.0.1:4173`
- Source: `package.json:scripts.start`

## Browser Checks
- `home-desktop`: `desktop` `http://127.0.0.1:4173`
- `home-mobile`: `mobile` `http://127.0.0.1:4173`

## Gaps
- None

## Structured Summary
```json
{
  "browser_checks": [
    {
      "assertions": {
        "no_console_errors": true,
        "no_horizontal_overflow": true,
        "no_page_errors": true
      },
      "id": "home-desktop",
      "required": true,
      "url": "http://127.0.0.1:4173",
      "viewport": "desktop"
    },
    {
      "assertions": {
        "no_console_errors": true,
        "no_horizontal_overflow": true,
        "no_page_errors": true
      },
      "id": "home-mobile",
      "required": true,
      "url": "http://127.0.0.1:4173",
      "viewport": "mobile"
    }
  ],
  "gaps": [],
  "generated_at": "2026-06-06T13:45:13.094077Z",
  "metadata": {
    "generated_at": "2026-06-06T13:50:03.372204Z",
    "last_smoke_status": "passed",
    "last_verified_at": "2026-06-06T13:50:03.357762Z",
    "last_verified_commit": "9347082e3cd8ba2a7f0d989d3ea44dc84aabad0d",
    "source_files": {
      ".enterprise/project.json": {
        "sha256": null,
        "status": "missing"
      },
      ".task2code/startup_plan.md": {
        "sha256": "sha256:229852b0aeaea62d6cc9d6ce92b44781257c11e9f819059ac13c4788b3702a97",
        "status": "found"
      },
      "Makefile": {
        "sha256": null,
        "status": "missing"
      },
      "README.md": {
        "sha256": "sha256:26cec4b98efce18ec7259be3eecf55a54e98bd7779298be637b9a7434ff45ab0",
        "status": "found"
      },
      "compose.yaml": {
        "sha256": null,
        "status": "missing"
      },
      "compose.yml": {
        "sha256": null,
        "status": "missing"
      },
      "docker-compose.yaml": {
        "sha256": null,
        "status": "missing"
      },
      "docker-compose.yml": {
        "sha256": null,
        "status": "missing"
      },
      "package.json": {
        "sha256": "sha256:edd65936b0c30c48a67437a75b86f8598913cb7ab7d8e8037c523abd50cbc0c4",
        "status": "found"
      },
      "server.js": {
        "sha256": "sha256:90263d7833bd4809aba617f9f64f85294fdc9dd7d81f8a2beb13f1e607510b0f",
        "status": "found"
      }
    },
    "stale_reasons": [],
    "valid_for_seconds": 604800
  },
  "schema_version": 1,
  "screenshots_required": false,
  "source": ".task2code/startup_plan.md",
  "source_files": [
    {
      "path": ".task2code/startup_plan.md",
      "status": "found"
    },
    {
      "path": ".enterprise/project.json",
      "status": "missing"
    },
    {
      "path": "package.json",
      "status": "found"
    },
    {
      "path": "server.js",
      "status": "found"
    },
    {
      "path": "Makefile",
      "status": "missing"
    },
    {
      "path": "docker-compose.yml",
      "status": "missing"
    },
    {
      "path": "docker-compose.yaml",
      "status": "missing"
    },
    {
      "path": "compose.yml",
      "status": "missing"
    },
    {
      "path": "compose.yaml",
      "status": "missing"
    },
    {
      "path": "README.md",
      "status": "found"
    }
  ],
  "start_commands": [
    {
      "command": "npm start",
      "cwd": ".",
      "id": "web",
      "required": true,
      "source": "package.json:scripts.start",
      "url": "http://127.0.0.1:4173"
    }
  ],
  "status": "resolved",
  "summary": "Startup plan resolved.",
  "workspace_relative_root": "."
}
```
