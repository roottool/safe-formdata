# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**safe-formdata** is a boundary-focused FormData parser that establishes a strict, security-oriented boundary between untrusted FormData input and application logic.

## Critical: Follow AGENTS.md

**All implementation and review decisions must strictly adhere to AGENTS.md**, which defines the non-negotiable technical rules:

- Implementation-level interpretation of README.md design principles
- Security implementation rules (prototype safety, forbidden keys)
- API contract and type definitions
- Non-goals (hard exclusions for any feature requests)
- Code review criteria ("Review rule of thumb")

When implementing features or reviewing code:

1. First, confirm alignment with README.md design principles
2. Then, apply AGENTS.md technical constraints
3. If a change makes the parser smarter/more convenient, it likely violates the boundary → reject it

## API Documentation

For complete API documentation, TypeScript interfaces, and usage examples, see **README.md**.

Key resources:

- API interfaces (ParseResult, ParseIssue)
- Issue codes (invalid_key, forbidden_key, duplicate_key)
- Security scope (in scope vs out of scope)
- Design decisions (Why no structural inference?, etc.)
- Versioning policy

## Usage Examples

The `examples/` directory contains comprehensive usage examples:

- `00-basic.ts` - Basic parsing and type narrowing
- `01-file-upload.ts` - File handling with type guards
- `02-field-presence.ts` - Field presence checks
- `03-error-handling.ts` - Validation issue handling
- `04-integration-fetch.ts` - Integration with Request/Fetch API

Run type checking for examples:

```bash
bun run check:type:example
```

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
bun run check:type:source   # TypeScript type checking
```

## Architecture Notes

This project follows a minimal, security-focused architecture:

- **TypeScript-based**: Strict type checking enabled
- **Minimal dependencies**: Zero runtime dependencies, minimal dev dependencies
- **Framework-agnostic**: Works with any JavaScript framework or runtime
- **Security-first**: Uses `Object.create(null)` to prevent prototype pollution
