# safe-formdata

**The strict trust boundary for FormData.**

[![npm version](https://img.shields.io/npm/v/safe-formdata)](https://www.npmjs.com/package/safe-formdata)
[![CI](https://github.com/roottool/safe-formdata/actions/workflows/ci.yml/badge.svg)](https://github.com/roottool/safe-formdata/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/roottool/safe-formdata/graph/badge.svg)](https://codecov.io/gh/roottool/safe-formdata)

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

safe-formdata defines a **strict trust boundary** between untrusted FormData input
and application logic.

Within this boundary, safe-formdata focuses exclusively on:

- Preventing **prototype pollution**
- Detecting **forbidden, invalid, and duplicate keys**
- Ensuring **explicit issue reporting** with no silent correction
- Providing **predictable, non-inferential parsing behavior**

Anything beyond this boundary — including value validation, schema enforcement,
framework conventions, authentication, or denial-of-service protection —
is **out of scope** and must be handled by the application.

📘 **Authoritative security guarantees, assumptions, and reporting policy:**  
See [SECURITY.md](./SECURITY.md)

Security decisions and issue triage are based on the definitions in SECURITY.md.

---

## API

### parse(formData): ParseResult

```ts
import { parse } from "safe-formdata";

const { data, issues } = parse(formData);
```

- `data` is `null` if any boundary violations are detected
- `issues` contains all detected structural issues
- Partial success is not allowed

### Result

```ts
export interface ParseResult {
  data: Record<string, string | File> | null;
  issues: ParseIssue[];
}
```

- `data` is non-null only when no boundary violations are detected
- `data` is always a flat object; no structural inference is performed
- `issues` must always be checked by the caller

### Issues

```ts
export interface ParseIssue {
  code: "invalid_key" | "forbidden_key" | "duplicate_key";
  path: string[];
  key?: unknown;
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
Record<string, string | File>;
```

### Why no multiple values or repeated keys?

HTML FormData allows the same key to appear multiple times
(e.g. multi-select inputs or repeated checkboxes).

safe-formdata intentionally treats repeated keys as a boundary violation
and reports them as `duplicate_key` issues.

While multiple values may be semantically valid in application logic,
their interpretation necessarily implies structure
(e.g. arrays, sets, ordering, or merging rules).

Defining or inferring such structure is outside the scope of safe-formdata.

safe-formdata establishes a strict, non-inferential boundary:
each key must map to exactly one value (`string` or `File`),
or the input is rejected.

If multiple values are required, they must be normalized
before or outside this boundary.

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
