# Contributing to safe-formdata

Thank you for your interest in contributing to safe-formdata!

This document provides guidelines for contributing to this boundary-focused FormData parser.

---

## Before You Start

**Please read these documents carefully:**

1. **README.md**: Understand the design principles and what safe-formdata is (and isn't)
2. **AGENTS.md**: Review the non-negotiable implementation rules
3. **Design decisions (Why not?)**: Understand why certain features are intentionally excluded

**Critical**: If your contribution makes the parser smarter, more convenient, or more opinionated, it likely violates the boundary and will be rejected.

---

## Development Setup

### Prerequisites

- Node.js ^20.19.0 || >= 22.12.0
- Package manager: Bun

This project uses Bun for development.
Other package managers are not supported.

### Installation

```bash
git clone https://github.com/roottool/safe-formdata.git
cd safe-formdata
bun install
```

### Development Workflow

```bash
bun run dev          # Watch mode for building
bun run test:watch   # Watch mode for testing
```

---

## Project Philosophy

safe-formdata establishes a **strict boundary** between untrusted FormData input and application logic.

### Core Principles (from README.md)

- 🧱 **Keys are opaque**: Never interpret key naming conventions
- 🚫 **No silent fixes**: Report issues, never correct them
- ⚖️ **Parsing is not validation**: Schema logic belongs outside the boundary
- 🔒️ **Security over convenience**: Surface unsafe input explicitly

### What We Will NOT Accept

Features that violate these principles:

- Structural inference (arrays, objects, nested data)
- Duplicate key resolution (first-wins, last-wins, merging)
- Value validation or type coercion
- Configuration options or flags
- Framework-specific behavior
- Performance optimizations that compromise correctness

See **AGENTS.md: Non-goals** for the complete list.

---

## Making Changes

### 1. Check AGENTS.md First

Before implementing:

1. Confirm alignment with **README.md design principles**
2. Apply **AGENTS.md technical constraints**
3. If unsure, open an issue for discussion

### 2. Code Quality Requirements

Run these commands before submitting:

```bash
bun run type-check   # TypeScript type checking must pass
bun run test         # All tests must pass
bun run build        # Build must succeed
```

### 3. Testing

- Write tests for all new functionality
- Maintain full coverage for boundary and security-critical paths
- Test security constraints (forbidden keys, prototype pollution)

```bash
bun run test:coverage   # View coverage report
```

### 4. Security Considerations

**Mandatory security rules** (AGENTS.md):

- Use `Object.create(null)` for parsed data (no prototype)
- Reject forbidden keys: `__proto__`, `constructor`, `prototype`
- Never throw for input-derived errors (return ParseResult with issues)

---

## Pull Request Guidelines

### PR Checklist

Before submitting a PR:

- [ ] Read README.md design principles
- [ ] Read AGENTS.md implementation rules
- [ ] Confirmed change does not violate the boundary
- [ ] Added tests for new functionality
- [ ] All tests pass (`bun run test`)
- [ ] Type checking passes (`bun run type-check`)
- [ ] Build succeeds (`bun run build`)

### PR Description

Include:

1. **Problem**: What issue does this solve?
2. **Solution**: How does this maintain the boundary?
3. **AGENTS.md compliance**: Which rules does this follow?
4. **Tests**: What test cases were added?

### Review Process

PRs will be evaluated against:

1. **Alignment with design principles** (README.md)
2. **Compliance with technical rules** (AGENTS.md)
3. **Review rule of thumb**: Does it make the parser smarter/more convenient? → Likely rejected

---

## Issue Guidelines

### Before Opening an Issue

1. **Feature requests**: Check **README.md: Design decisions (Why not?)** first
2. **Bug reports**: Ensure it's a boundary violation, not expected behavior

### Feature Requests

Most feature requests will be declined because they violate the boundary.

**Acceptable**: Bugs in boundary enforcement, security issues, documentation improvements
**Not acceptable**: Convenience features, structural inference, schema validation

### Security Issues

For security vulnerabilities, please open an issue or contact the maintainer directly.

---

## Questions?

- Open an issue for discussion
- Reference **AGENTS.md** for implementation questions
- Reference **README.md** for design philosophy questions

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
