# CLAUDE.md

## Critical: Follow AGENTS.md

**All implementation and review decisions must strictly adhere to AGENTS.md.**

When implementing features or reviewing code:

1. First, confirm alignment with README.md design principles
2. Then, apply AGENTS.md technical constraints
3. If a change makes the parser smarter/more convenient, it likely violates the boundary → reject it

## Agent Skills

The `boundary-validator` skill (`skills/boundary-validator/`) validates code changes against AGENTS.md design rules.
See AGENTS.md for trigger conditions and usage across agents.

**Usage in Claude Code**:

```text
Review this code against boundary-validator rules
```

## Usage Examples

The `examples/` directory contains usage examples:

- `00-basic.ts` - Basic parsing and type narrowing
- `01-file-upload.ts` - File handling with type guards
- `02-field-presence.ts` - Field presence checks
- `03-error-handling.ts` - Validation issue handling
- `04-integration-fetch.ts` - Integration with Request/Fetch API

Run type checking for examples:

```bash
bun run check:type:example
```

## Toolchain

| Tool                   | Role                            |
| ---------------------- | ------------------------------- |
| **bun**                | Package manager / script runner |
| **TypeScript** (`tsc`) | Type checking                   |
| **tsup**               | Build (bundler)                 |
| **vitest**             | Test runner                     |
| **oxlint**             | Linter                          |
| **oxfmt**              | Formatter (TS/JS/JSON)          |
| **publint** / **attw** | Package export validation       |
| **npm-run-all2**       | Script orchestration            |

## Development Commands

### Setup

```bash
bun install
```

### Development

```bash
bun run dev          # Watch mode for building
bun run test:watch   # Watch mode for testing
```

### Linting & Formatting

```bash
bun run lint         # oxlint (deny-warnings)
bun run lint:fix     # oxlint --fix-suggestions
bun run format       # oxfmt (write)
bun run fix          # lint:fix + format (all-in-one auto-fix)
```

### Quality Checks

```bash
bun run check            # lint + format check (read-only)
bun run check:type       # TypeScript check (source + examples)
bun run check:type:source   # TypeScript check (source only)
bun run check:type:example  # TypeScript check (examples only)
bun run check:package    # publint + attw export validation
```

### Testing

```bash
bun run test              # Run all tests
bun run test:coverage     # Run tests with coverage report
```

### Build

```bash
bun run build             # Build for production (tsup)
```

### Publishing

```bash
bun run prepare:publish   # Full pre-publish pipeline: type check → test:coverage → build → check:package
```

## CI/CD

- **Workflows**: `.github/workflows/`
  - `ci.yml` - Main CI pipeline
  - `publish.yml` - npm publish
  - `prepare-release-pr.yml` - Release PR automation
  - `wc-*.yml` - Reusable workflow components (type-check, lint-format, test, etc.)
- **PR template**: `.github/PULL_REQUEST_TEMPLATE.md`
- **Renovate**: `.github/renovate.json`

## Important: No `.ok` Property

`ParseResult` does not have a `.ok` property. Use `data !== null` to narrow the type:

```typescript
// Correct
if (result.data !== null) {
}

// Wrong - .ok does not exist
if (result.ok) {
}
```
