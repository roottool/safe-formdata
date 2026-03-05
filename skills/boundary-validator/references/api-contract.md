# API Contract

This document contains the API contract rules extracted from AGENTS.md.

These constraints ensure API stability and prevent breaking changes.

---

## Public API (Minimal and Stable)

Single function, no overloads, no options:

```typescript
parse(formData: FormData): ParseResult
```

Named utility types derived from `ParseResult`:

```typescript
type SuccessResult = Extract<ParseResult, { data: Record<string, string | File> }>;
type FailureResult = Extract<ParseResult, { data: null }>;
```

See implementation: [`src/index.ts`](../../../src/index.ts), [`src/parse.ts`](../../../src/parse.ts)

### Violations

```typescript
// ❌ Adding overloads
function parse(formData: FormData): ParseResult;
function parse(formData: FormData, options: ParseOptions): ParseResult;

// ❌ Adding options
function parse(formData: FormData, options?: { allowDuplicates?: boolean }): ParseResult;

// ❌ Framework adapters
function parseRequest(req: NextRequest): ParseResult;
```

---

## Type Definitions

See source: [`src/types/ParseResult.ts`](../../../src/types/ParseResult.ts), [`src/types/ParseIssue.ts`](../../../src/types/ParseIssue.ts), [`src/types/IssueCode.ts`](../../../src/types/IssueCode.ts)

### Type Narrowing Pattern

```typescript
if (result.data !== null) {
  // data is Record<string, string | File>, issues is []
} else {
  // data is null, issues is [ParseIssue, ...ParseIssue[]]
}
```

### No `.ok` Property

```typescript
// ❌ Wrong
if (result.ok) {
  /* ... */
}

// ✅ Correct
if (result.data !== null) {
  /* ... */
}
```

### IssueCode Constraint

**No additional IssueCode may be introduced without a major version bump.**

```typescript
// ❌ Adding codes — requires major version bump
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key" | "invalid_value";
```

---

## Versioning Policy

- **Patch versions** (0.1.x): bugfixes, no API changes
- **Minor versions** (0.x.0): Breaking changes allowed in 0.x (treated as effectively major)
- **Major versions** (1.0.0+): Breaking changes allowed

### What Counts as Breaking

- Adding/removing `IssueCode` values
- Changing `ParseResult` structure
- Adding required parameters to `parse()`
- Removing or renaming exported types

---

## Review Checklist

- [ ] Public API remains `parse(formData): ParseResult` only
- [ ] `SuccessResult` / `FailureResult` are derived from `ParseResult` (not independently defined)
- [ ] No overloads added
- [ ] No options parameters added
- [ ] `ParseResult` structure unchanged
- [ ] `IssueCode` values unchanged (or major version bump planned)
- [ ] Type narrowing pattern still works (`data !== null`)

---

**Source**: AGENTS.md (lines 119-199)
**Last updated**: 2026-03-06
