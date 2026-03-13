# Contributing

## Dev Environment Setup

```bash
# Install dependencies
bun install

# Copy env files
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# Start dev servers
bun run dev
```

See [README.md](./README.md) for database setup.

## Coding Standards

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
bun run check       # lint + format (auto-fix)
bun run check-types # type check
```

Pre-commit hooks run `bun run check` automatically via [lefthook](https://github.com/evilmartians/lefthook).

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `chore:` | Tooling, deps, config |
| `refactor:` | Code restructuring |
| `test:` | Tests |
| `docs:` | Documentation |
| `ci:` | CI/CD changes |

## Branch Workflow

1. Create a feature branch from `main`
2. Make commits with passing lint/typecheck
3. Open a PR — CI will run lint, typecheck, and build

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TanStack Router + Tailwind |
| Backend | Hono + Bun |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Better-Auth |
| Monorepo | Turborepo |
| Lint/Format | Biome |
