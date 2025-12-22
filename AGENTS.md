# AGENTS.md

## Prerequisites

This document translates the design principles and decisions in **README.md** into implementation-level technical rules.

Before implementing, review:

- README.md: Design principles
- README.md: Security scope
- README.md: Design decisions (Why not?)

---

## Purpose

safe-formdata is a **boundary-focused FormData parser**.

Its sole responsibility is to establish a strict, security-oriented boundary
between untrusted FormData input and application logic.

This document defines the non-negotiable rules for implementation and review.

---

## Core concept: Boundary

- FormData input is untrusted.
- Parsing must not infer structure, semantics, or intent.
- Unsafe or ambiguous input must be reported, never corrected.

The boundary must be explicit, minimal, and stable.

---

## Design rules (must not be violated)

### 1. Keys are opaque strings

- Do not interpret key naming conventions.
- Do not parse `[]`, `.`, or bracket notation.
- Treat keys as raw, uninterpreted strings.

---

### 2. No silent behavior

- Do not merge duplicate keys.
- Do not overwrite values.
- Do not apply first-wins or last-wins semantics.

All duplicate keys are boundary violations.

---

### 3. No inference, no convenience

- Do not infer arrays or objects.
- Do not coerce types.
- Do not validate values.
- Do not add configuration options.

Convenience features belong outside the boundary.

---

### 4. Explicit issue reporting

- Never throw for input-derived errors.
- Always return a ParseResult with issues.
- Partial success is not allowed:
  - If issues exist, `data` must be `null`.

---

## Security rules (mandatory)

### Prototype safety

- Explicitly forbid:
  - `__proto__`
  - `constructor`
  - `prototype`
- Reject any input containing forbidden keys.

### Data container

- Parsed data **must** be created with no prototype.

```ts
Object.create(null);
```

This is non-optional and part of the boundary definition.

---

## Security guarantees

> **Note**: For security scope definitions, see **README.md Security scope section**.

For implementation-level security constraints, see the **Security rules (mandatory) section** above.

---

## ParseIssue contract

### Allowed IssueCode values (fixed)

- `invalid_key`
- `forbidden_key`
- `duplicate_key`

No additional IssueCode may be introduced without a major version bump.

### ParseIssue shape

- `code` must be one of the allowed IssueCode values.
- `path` must always be an empty array (no structural inference). This field exists only to preserve compatibility with external issue formats.
- `key?` may contain the problematic key when an issue occurs (for debugging purposes).
- Issues are informational, not exceptions.

Note: In v1.0+, additional fields such as `message: string` and `meta?: Record<string, unknown>` may be considered for enhanced error reporting.

---

## API contract

### Public API (minimal and stable)

```ts
parse(formData): ParseResult
```

- No overloads
- No options
- No framework-specific adapters

### Type definitions

```ts
export interface ParseResult {
  data: Record<string, string | File> | null
  issues: ParseIssue[]
}

export interface ParseIssue {
  code: ParseIssueCode
  path: string[]
  key?: unknown
}

export type ParseIssueCode = "invalid_key" | "forbidden_key" | "duplicate_key"
```

---

## Non-goals (hard exclusions)

The implementation must not include:

- Structural inference
- Duplicate key resolution
- Schema validation
- Framework conventions (e.g. PHP-style arrays)
- Performance optimizations that compromise correctness
- Business or application logic

If a feature conflicts with these, it must be rejected.

---

## v0.1.0 scope

v0.1.0 establishes the FormData boundary with:

- Flat FormData parsing into a plain JavaScript object
- Detection of forbidden, duplicate, and invalid keys
- Non-throwing issue reporting
- A minimal, stable public API

---

## Versioning

For versioning policy details, see **README.md Versioning section**.

---

## Review rule of thumb

If a change makes the parser:

- smarter
- more convenient
- more opinionated

it likely violates the boundary.

When in doubt, reject the change.
