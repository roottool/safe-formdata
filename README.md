# safe-formdata

**The strict trust boundary for FormData.**

safe-formdata is a **security-focused** parser that establishes a predictable boundary between untrusted input and application logic.
It enforces strict rules on keys and forbids structural inference by design.

---

## Overview

FormData is untyped and unstructured by nature.
Many parsers attempt to infer structure or semantics from key naming conventions.

safe-formdata intentionally does not.

It performs only minimal, security-focused parsing and reports
all structural issues explicitly, without inferring structure, intent, or meaning.

---

## Design principles

- 🧱 **Keys are opaque**  
  Key names are never interpreted as structure.
- 🚫 **No silent fixes**  
  Invalid or conflicting input is reported, not corrected.
- ⚖️ **Parsing is not validation**  
  Schema and business logic belong outside the boundary.
- 🔒️ **Security over convenience**  
  Unsafe input is surfaced early and explicitly.

---

## Security scope

### In scope

- Forbidden keys (e.g. prototype pollution)
- Duplicate keys
- Structurally invalid keys
- Explicit reporting of all issues

### Out of scope

- Value validation or coercion
- Authentication or authorization
- Denial-of-service protection
- Framework-specific behavior

safe-formdata reports issues instead of throwing,
to preserve the integrity of the FormData boundary.

---

## API

### parse(formData): ParseResult

```ts
import { parse } from 'safe-formdata'

const { data, issues } = parse(formData)
```

- `data` is `null` if any boundary violations are detected
- `issues` contains all detected structural issues
- Partial success is not allowed

### Result

```ts
export interface ParseResult {
  data: Record<string, string | File> | null
  issues: ParseIssue[]
}
```

- `data` is non-null only when no boundary violations are detected
- `data` is always a flat object; no structural inference is performed
- `issues` must always be checked by the caller

### Issues

```ts
export interface ParseIssue {
  code: 'invalid_key' | 'forbidden_key' | 'duplicate_key'
  path: string[]
  key?: unknown
}
```

- `path` is always empty and exists only for compatibility
- Issues are informational and are never thrown

## Design decisions (Why not?)

safe-formdata intentionally omits several common features.

### Why no structural inference?

Keys such as `a[b][c]`, `user.name`, or `items[]`
are treated as opaque strings, not paths.

```ts
{
  "a[b][c]": "value"
}
```

Inferring structure introduces ambiguity and security risks.
safe-formdata validates keys, but never constructs objects from them.

### Why no generic type parameters?

safe-formdata does not produce typed structural output.

Allowing generic types would imply runtime guarantees
that the library intentionally does not provide.

The output type is intentionally flat:

```ts
Record<string, string | File>
```

### Why no throwing or `parseOrThrow`?

FormData is external input.
Throwing encourages accidental 500 errors and obscures boundary handling.

safe-formdata exposes a single, explicit error-handling model:
inspect issues and decide what to do.

### What is safe-formdata not?

- Not a schema validator
- Not a typed form parser
- Not a replacement for Zod, Yup, or similar libraries

safe-formdata defines a safe boundary.
Validation and typing belong beyond it.

## Versioning

v0.x focuses exclusively on establishing and clarifying the FormData boundary.
No inference or convenience features will be added within v0.x.

## License

MIT
