# LixenAI Operating System

All-in-one business operating system monorepo. Command Center dashboard + Agent-OS agent layer + shared UI, auth, and config packages.

## Structure

```
launch-command-center/
├── apps/
│   ├── command-center/      ← Next.js dashboard (launch playbook, tracker, library)
│   └── agent-os/            ← Python FastAPI agent layer (orchestrator, workflows, integrations)
├── packages/
│   ├── ui/                  ← Shared React design system (light theme, #5BB8FF accent)
│   ├── auth/                ← Shared auth utilities (GHL OAuth, API key validation)
│   ├── config/              ← Shared env loader, constants, API clients
│   └── types/               ← Shared TypeScript interfaces
├── .env.example
├── package.json             ← npm workspaces root
├── turbo.json
└── render.yaml              ← Multi-service Render deploy config
```

## Prerequisites

- **Node.js**: v22 (see `.nvmrc`)
- **Python**: 3.9+ (for Agent-OS)
- **npm**: v10+ (workspaces support)

## Install

```bash
npm install
```

## Run

```bash
# Command Center (Next.js dev server)
npm run dev:command

# Agent-OS (Python FastAPI server)
npm run dev:agent
```

## Build

```bash
# Build all JS/TS workspaces
npm run build
```

## Add a New App or Package

```bash
# New app
mkdir apps/my-new-app
cd apps/my-new-app
npm init -y
# Add to root package.json workspaces (already wildcarded)

# New package
mkdir packages/my-new-package
# Same as above
```

## Shared Packages

| Package | Import | Contents |
|---------|--------|----------|
| `@lixen/types` | `import type { ... } from "@lixen/types"` | TypeScript interfaces |
| `@lixen/auth` | `import { ... } from "@lixen/auth"` | Auth utilities, GHL OAuth |
| `@lixen/config` | `import { ... } from "@lixen/config"` | Env loader, API clients, constants |
| `@lixen/ui` | `import { ... } from "@lixen/ui"` | React components, design system |

## Design System

- **Light theme only** — no dark mode
- Background: `#FFFFFF`, `#FAFAFA`
- Primary accent: `#5BB8FF` (soft blue neon)
- Pastel and neutral supporting palette only
- Typography: Inter, clean sans-serif

## Deploy

Render reads `render.yaml` and deploys both services.
Shared environment variables are configured via Render Environment Group `lixen-shared`.

## License

Private — LixenAI internal use.