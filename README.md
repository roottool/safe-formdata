# safe-formdata

**The strict trust boundary for FormData.**

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/roottool/safe-formdata)
[![npm version](https://img.shields.io/npm/v/safe-formdata)](https://www.npmjs.com/package/safe-formdata)
[![CI](https://github.com/roottool/safe-formdata/actions/workflows/ci.yml/badge.svg)](https://github.com/roottool/safe-formdata/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/roottool/safe-formdata/graph/badge.svg)](https://codecov.io/gh/roottool/safe-formdata)

safe-formdata is a strict FormData parser.
It enforces rules on keys and forbids structural inference by design.

## Table of Contents

- [safe-formdata](#safe-formdata)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Design principles](#design-principles)
  - [Security scope](#security-scope)
  - [Design decisions (Why not?)](#design-decisions-why-not)
    - [Why no structural inference?](#why-no-structural-inference)
    - [Why no generic type parameters?](#why-no-generic-type-parameters)
    - [Why no multiple values or repeated keys?](#why-no-multiple-values-or-repeated-keys)
    - [Why no throwing or `parseOrThrow`?](#why-no-throwing-or-parseorthrow)
    - [What is safe-formdata not?](#what-is-safe-formdata-not)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [API](#api)
    - [parse(formData): ParseResult](#parseformdata-parseresult)
    - [Result](#result)
    - [Issues](#issues)
  - [Versioning](#versioning)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

FormData is untyped and unstructured by nature.
Parsers often attempt to infer structure or semantics from key naming conventions.

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

Security guarantees, assumptions, and reporting policy: [SECURITY.md](./SECURITY.md)

---

## Design decisions (Why not?)

safe-formdata intentionally omits the following common features.

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

safe-formdata enforces a strict rule:
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

---

## Installation

Install:

```bash
# npm
npm install safe-formdata

# yarn
yarn add safe-formdata

# pnpm
pnpm add safe-formdata

# bun
bun add safe-formdata
```

**Requirements**: TypeScript 5.0+ (for discriminated union type narrowing)

---

## Quick Start

```typescript
import { parse } from "safe-formdata";

const formData = new FormData();
formData.append("username", "alice");
formData.append("age", "25");

const result = parse(formData);

if (result.data !== null) {
  // Success: data is available
  console.log(result.data.username); // 'alice'
  console.log(result.data.age); // '25'
} else {
  // Failure: validation issues occurred
  console.error(result.issues);
}
```

### Key points

- All values are `string | File` - no automatic type conversion
- Use `data !== null` to check for success and narrow the type

See [examples/](./examples) for file upload handling and more.

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
export type ParseResult =
  | { data: Record<string, string | File>; issues: [] }
  | { data: null; issues: [ParseIssue, ...ParseIssue[]] };
```

- `data` is non-null only when no boundary violations are detected
- `data` is always a flat object; no structural inference is performed
- Use `data !== null` to narrow the type; `issues` is `[]` on success and non-empty on failure

### Issues

```ts
export interface ParseIssue {
  code: "invalid_key" | "forbidden_key" | "duplicate_key";
  key: string;
}
```

- `key` is the original FormData key that caused the issue
- Issues are informational and are never thrown

---

## Versioning

v0.x focuses exclusively on establishing and clarifying the FormData boundary.
No inference or convenience features will be added within v0.x.

## Contributing

See:

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributor guide
- [docs/PUBLISHING.md](docs/PUBLISHING.md) - Publishing guide (for maintainers)

## License

MIT
