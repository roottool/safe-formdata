# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**safe-formdata** is a boundary-focused FormData parser that establishes a strict, security-oriented boundary between untrusted FormData input and application logic.

## Critical: Follow AGENTS.md

**All implementation and review decisions must strictly adhere to AGENTS.md**, which defines the non-negotiable rules for this project:

- Core design rules (opaque keys, no silent behavior, no inference, explicit issue reporting)
- Security rules (prototype safety, prototype-free data containers)
- API contract (minimal public API, fixed IssueCode values)
- Non-goals (hard exclusions)
- Review criteria

When in doubt, consult AGENTS.md. If a change makes the parser smarter, more convenient, or more opinionated, it likely violates the boundary and should be rejected.

## API Documentation

For complete API documentation, TypeScript interfaces, and usage examples, see **README.md**.

Key resources:

- ParseResult and ParseIssue interfaces
- ParseIssueCode values and meanings
- Security guarantees (in scope vs out of scope)
- v0.1.0 scope definition

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

### Testing
```bash
bun run test              # Run all tests
bun run test:coverage     # Run tests with coverage report
```

### Build
```bash
bun run build        # Build for production
bun run type-check   # TypeScript type checking
```

### Publishing
```bash
npm publish          # Publish to npm (runs prepublishOnly hook)
```

## Architecture Notes

This project follows a minimal, security-focused architecture:

- **TypeScript-based**: Strict type checking enabled
- **Minimal dependencies**: Zero runtime dependencies, minimal dev dependencies
- **Framework-agnostic**: Works with any JavaScript framework or runtime
- **Security-first**: Uses `Object.create(null)` to prevent prototype pollution
