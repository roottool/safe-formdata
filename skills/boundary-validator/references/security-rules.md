# Security Rules (Mandatory)

This document contains the mandatory security rules extracted from AGENTS.md.

These rules are non-negotiable and must be enforced in all implementations.

---

## Prototype Safety

### Forbidden Keys

Explicitly forbid the following keys:

- `__proto__`
- `constructor`
- `prototype`

**Reject any input containing forbidden keys.**

### Rationale

These keys can be exploited for prototype pollution attacks, which allow attackers to modify the prototype chain of JavaScript objects and potentially execute arbitrary code or cause denial-of-service.

### Violations

```typescript
// Accepting forbidden keys
const data = {};
data[key] = value; // If key === '__proto__', this pollutes the prototype

// Not checking for forbidden keys
for (const [key, value] of formData.entries()) {
  data[key] = value; // Dangerous if key is forbidden
}
```

See correct implementation: `src/parse.ts`

---

## Data Container

### Prototype-less Objects

Parsed data **must** be created with no prototype:

```typescript
const data = Object.create(null);
```

**This is non-optional and part of the boundary definition.**

### Rationale

Using `{}` or `new Object()` creates objects with `Object.prototype` in their prototype chain. This makes the data container vulnerable to prototype pollution and adds unnecessary properties (`toString`, `hasOwnProperty`, etc.) that could conflict with FormData keys.

### Violations

```typescript
// Using plain object literal
const data = {};

// Using Object constructor
const data = new Object();
```

See correct implementation: `src/parse.ts`

---

## Security Scope

### In Scope (What safe-formdata protects against)

- ✅ Prototype pollution via forbidden keys
- ✅ Prototype chain contamination via `Object.create(null)`

### Out of Scope (Application's responsibility)

- ❌ XSS attacks (application must sanitize values)
- ❌ SQL injection (application must use parameterized queries)
- ❌ Path traversal (application must validate file paths)
- ❌ Denial-of-service via large payloads (runtime/framework must set limits)

---

## Implementation Checklist

When implementing or reviewing security-related code:

- [ ] Forbidden keys are explicitly checked (`__proto__`, `constructor`, `prototype`)
- [ ] Forbidden keys trigger `forbidden_key` issue (not exceptions)
- [ ] Data container is created with `Object.create(null)` (not `{}`)
- [ ] Tests verify forbidden keys are rejected
- [ ] Tests verify data container has no prototype

---

**Source**: AGENTS.md (lines 76-95)
**Last updated**: 2026-03-06
