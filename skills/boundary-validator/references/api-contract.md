# API Contract

This document contains the API contract rules extracted from AGENTS.md.

These constraints ensure API stability and prevent breaking changes.

---

## Public API (Minimal and Stable)

The safe-formdata public API consists of a single function and utility types:

```typescript
parse(formData: FormData): ParseResult

// Named utility types derived from ParseResult
type SuccessResult = Extract<ParseResult, { data: Record<string, string | File> }>;
type FailureResult = Extract<ParseResult, { data: null }>;
```

### Constraints

- **No overloads**: The function has exactly one signature
- **No options**: No optional parameters or configuration objects
- **No framework-specific adapters**: Works with standard FormData only

### Rationale

A minimal API surface reduces maintenance burden, prevents feature creep, and maintains the boundary-focused philosophy. Any additional functionality belongs in separate libraries that build on top of safe-formdata.

### Examples

**❌ Violations**:

```typescript
// Adding overloads
function parse(formData: FormData): ParseResult;
function parse(formData: FormData, options: ParseOptions): ParseResult;

// Adding options
function parse(formData: FormData, options?: { allowDuplicates?: boolean }): ParseResult;

// Adding framework adapters
function parseRequest(req: NextRequest): ParseResult;
function parseFromExpress(req: express.Request): ParseResult;
```

**✅ Correct**:

```typescript
// Single, stable signature
export function parse(formData: FormData): ParseResult {
  // Implementation
}
```

---

## Type Definitions

### ParseResult (Discriminated Union)

```typescript
export type ParseResult =
  | {
      data: Record<string, string | File>;
      issues: [];
    }
  | {
      data: null;
      issues: [ParseIssue, ...ParseIssue[]];
    };
```

#### Constraints

- **Must be a discriminated union**: Two distinct shapes based on success/failure
- **Success state**: `data` is a Record, `issues` is an empty array (literal type `[]`)
- **Failure state**: `data` is `null`, `issues` is a non-empty tuple (`[ParseIssue, ...ParseIssue[]]`)
- **No intermediate states**: Partial success is not allowed

#### Type Narrowing Pattern

```typescript
if (result.data !== null) {
  // TypeScript knows: data is Record<string, string | File>
  // TypeScript knows: issues is []
  console.log(result.data.username);
} else {
  // TypeScript knows: data is null
  // TypeScript knows: issues is [ParseIssue, ...ParseIssue[]]
  console.error(result.issues);
}
```

#### Important: No `.ok` Property

Unlike some libraries (e.g., `Result<T, E>` types), `ParseResult` does **not** have a `.ok` property.

**❌ Wrong**:

```typescript
if (result.ok) {
  /* ... */
}
```

**✅ Correct**:

```typescript
if (result.data !== null) {
  /* ... */
}
```

---

### ParseIssue

```typescript
export interface ParseIssue {
  code: IssueCode;
  key: string;
}
```

#### Constraints

- **`code`**: Must be one of the allowed IssueCode values
- **`key`**: Must be the original FormData key that caused the issue, reported as-is without interpretation
- **Issues are informational, not exceptions**

#### Future Considerations

In v1.0+, additional fields may be considered:

- `message?: string` - Human-readable error message
- `meta?: Record<string, unknown>` - Additional metadata

**Any such changes would require a major version bump.**

---

### IssueCode

```typescript
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";
```

#### Allowed Values (Fixed)

- `invalid_key` - Key is invalid (empty, wrong type, etc.)
- `forbidden_key` - Key is forbidden (`__proto__`, `constructor`, `prototype`)
- `duplicate_key` - Key appears multiple times in FormData

#### Constraint

**No additional IssueCode may be introduced without a major version bump.**

#### Examples

**❌ Violations** (Breaking changes):

```typescript
// Adding new issue codes (requires major version bump)
export type IssueCode =
  | "invalid_key"
  | "forbidden_key"
  | "duplicate_key"
  | "invalid_value" // NEW - Breaking change!
  | "too_many_fields"; // NEW - Breaking change!

// Removing existing codes (requires major version bump)
export type IssueCode = "invalid_key" | "forbidden_key";
// "duplicate_key" removed - Breaking change!

// Renaming codes (requires major version bump)
export type IssueCode = "bad_key" | "forbidden_key" | "duplicate_key";
// "invalid_key" → "bad_key" - Breaking change!
```

**✅ Correct** (Non-breaking changes):

```typescript
// v0.1.0 - Initial release
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";

// v0.2.0 - No changes to IssueCode (patch or minor bump allowed)
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";

// v1.0.0 - Major version allows changes
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key" | "invalid_value"; // OK in major version
```

---

## Type Documentation

All type definitions include comprehensive JSDoc comments for IDE integration.

See:

- `src/types/ParseResult.ts` - Discriminated union with type narrowing examples
- `src/types/ParseIssue.ts` - Issue structure and property explanations
- `src/types/IssueCode.ts` - Security-focused issue code definitions

### JSDoc Example

````typescript
/**
 * Result of parsing FormData.
 *
 * This is a discriminated union:
 * - Success: `data` is a Record, `issues` is `[]`
 * - Failure: `data` is `null`, `issues` contains errors
 *
 * Use `data !== null` to narrow the type:
 *
 * @example
 * ```ts
 * const result = parse(formData);
 *
 * if (result.data !== null) {
 *   // Success: result.data is Record<string, string | File>
 *   console.log(result.data.username);
 * } else {
 *   // Failure: result.issues is ParseIssue[]
 *   console.error(result.issues);
 * }
 * ```
 */
export type ParseResult =
  | { data: Record<string, string | File>; issues: [] }
  | { data: null; issues: [ParseIssue, ...ParseIssue[]] };
````

---

## Versioning Policy

For complete versioning policy, see README.md Versioning section.

### Key Points

- **Patch versions** (0.1.x): bugfixes, no API changes
- **Minor versions** (0.x.0): Non-breaking additions (with caution in 0.x)
- **Major versions** (1.0.0+): Breaking changes allowed

### What Counts as Breaking

The following changes are **breaking** and require a major version bump:

- Adding/removing `IssueCode` values
- Changing `ParseResult` structure
- Adding required parameters to `parse()`
- Changing return type of `parse()`
- Removing or renaming exported types

### What Counts as Non-Breaking

The following changes are **non-breaking** and allowed in minor/patch versions:

- Bugfixes in parsing logic
- Performance improvements
- Internal refactoring
- Documentation improvements
- Adding optional JSDoc comments

---

## Review Checklist

When reviewing API changes:

- [ ] Public API remains `parse(formData): ParseResult` only
- [ ] `SuccessResult` / `FailureResult` utility types are derived from `ParseResult` (not independently defined)
- [ ] No overloads added
- [ ] No options parameters added
- [ ] `ParseResult` structure unchanged
- [ ] `IssueCode` values unchanged (or major version bump planned)
- [ ] Type narrowing pattern still works (`data !== null`)
- [ ] JSDoc comments updated (if applicable)

---

**Source**: AGENTS.md (lines 119-199)
**Last updated**: 2026-03-02
