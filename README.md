# safe-formdata

**FormData Boundary**

safe-formdata is a boundary-focused FormData parser. It enforces a strict boundary between untrusted input and application logic.

---

## Overview

FormData is inherently untyped and unstructured. Many existing parsers attempt to infer meaning from key naming conventions, silently merging or transforming input along the way.

safe-formdata takes a different approach.

It establishes a strict boundary at the point where FormData enters your application, performing only minimal, security-focused parsing without inferring structure, semantics, or intent.

---

## Design principles

safe-formdata is built around the following principles:

- **Keys are opaque strings**  
  No structure is inferred from key names.

- **No silent fixes**  
  Invalid or conflicting input is reported, not corrected.

- **Parsing is not validation**  
  Structural parsing is separated from schema or business logic.

- **Security over convenience**  
  Unsafe input is surfaced early and explicitly.

---

## Security guarantees

safe-formdata provides the following guarantees **within its scope**.

### In scope

- Prevention of prototype pollution via forbidden keys
- Detection of duplicate keys
- Detection of structurally invalid keys
- Explicit reporting of all structural issues

### Out of scope

- Value validation or type coercion
- Authorization or authentication
- Denial-of-service protection (e.g. large payloads)
- Framework- or ecosystem-specific behavior

safe-formdata reports structural issues instead of throwing,
to preserve the integrity of the FormData boundary.

---

## Non-goals

safe-formdata intentionally does **not** attempt to:

### Infer structure from keys

- Interpret bracket notation such as `items[]` or `user[name]`
- Convert naming conventions into arrays or nested objects

Keys are treated as opaque strings.

---

### Merge or override duplicate keys

- Merge values into arrays
- Apply first-wins or last-wins semantics

Duplicate keys are always reported as boundary violations.

---

### Perform validation or type coercion

- Validate value formats or ranges
- Coerce strings into numbers, booleans, or other types

Validation belongs outside the FormData boundary.

---

### Handle business or application logic

- Authorization or authentication decisions
- Application-specific semantics

---

### Provide framework- or ecosystem-specific behavior

- PHP-style array encoding
- Framework conventions (e.g. Express, Rails, Laravel)

safe-formdata is framework-agnostic by design.

---

## API

### parse(formData)

```ts
import { parse } from 'safe-formdata'

const result = parse(formData)
```

Returns a `ParseResult`.

---

## ParseResult

```ts
export interface ParseResult<T = Record<string, string | File>> {
  data: T | null
  issues: ParseIssue[]
}
```

- `data` is `null` if any boundary violations are detected
- `issues` contains all detected structural issues

Partial success is not allowed.

---

## ParseIssue

```ts
export interface ParseIssue {
  code: ParseIssueCode
  message: string
  path: string[]
  meta?: Record<string, unknown>
}
```

Issues are informational and must be handled explicitly by the caller. They are not thrown as exceptions.
The `path` field is always an empty array and exists solely for compatibility with schema-driven error formats.

---

### ParseIssueCode

```ts
export type ParseIssueCode =
  | 'invalid_key'
  | 'forbidden_key'
  | 'duplicate_key'
```

#### invalid_key

The FormData key is not a valid string key.

---

#### forbidden_key

The key is explicitly forbidden for security reasons (e.g. prototype pollution).

---

#### duplicate_key

The same key appears more than once.

---

## Versioning

### v0.1.0 scope

v0.1.0 establishes the FormData boundary.

This release focuses exclusively on safe, minimal parsing of FormData
without inferring structure, semantics, or intent.

#### In scope (v0.1.0)

- Flat FormData parsing into a plain JavaScript object
- Detection of forbidden, duplicate, and invalid keys
- Non-throwing issue reporting
- A minimal, stable public API

#### Out of scope (v0.1.0)

- Structural inference (arrays or objects)
- Duplicate key resolution
- Validation or schema integration
- Framework-specific behavior
- Performance optimizations beyond correctness

Within v0.x:

- The FormData boundary definition will not change
- IssueCode semantics will remain stable
- No inference or convenience features will be added

Breaking changes may occur before v1.0 only to strengthen or clarify the boundary.

---

## License

MIT
