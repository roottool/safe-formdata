# Security Rules (Mandatory)

This document contains the mandatory security rules extracted from AGENTS.md.

These rules are non-negotiable and must be enforced in all implementations.

---

## Prototype Safety

### Forbidden Keys

Explicitly forbid the following keys.

- `__proto__`
- `constructor`
- `prototype`

**Reject any input containing forbidden keys.**

### Rationale

These keys can be exploited for prototype pollution attacks, which allow attackers to modify the prototype chain of JavaScript objects and potentially execute arbitrary code or cause denial-of-service.

### Examples

**❌ Violations**:

```typescript
// Accepting forbidden keys
const data = {};
data[key] = value; // If key === '__proto__', this pollutes the prototype

// Not checking for forbidden keys
for (const [key, value] of formData.entries()) {
  data[key] = value; // Dangerous if key is forbidden
}
```

**✅ Correct**:

```typescript
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"] as const;

for (const [key, value] of formData.entries()) {
  // Check for forbidden keys
  if (FORBIDDEN_KEYS.includes(key as any)) {
    issues.push({
      code: "forbidden_key",
      key,
    });
    continue; // Do not process forbidden keys
  }

  data[key] = value;
}
```

### Test Cases

Implementations must include tests that verify forbidden keys are rejected:

```typescript
// Test: __proto__ is rejected
const formData = new FormData();
formData.append("__proto__", "malicious");
const result = parse(formData);

expect(result.data).toBeNull();
expect(result.issues).toContainEqual({
  code: "forbidden_key",
  key: "__proto__",
});

// Test: constructor is rejected
formData.clear();
formData.append("constructor", "malicious");
const result2 = parse(formData);

expect(result2.data).toBeNull();
expect(result2.issues).toContainEqual({
  code: "forbidden_key",
  key: "constructor",
});

// Test: prototype is rejected
formData.clear();
formData.append("prototype", "malicious");
const result3 = parse(formData);

expect(result3.data).toBeNull();
expect(result3.issues).toContainEqual({
  code: "forbidden_key",
  key: "prototype",
});
```

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

### Examples

**❌ Violations**:

```typescript
// Using plain object literal
const data = {};
// data.__proto__ === Object.prototype (vulnerable)

// Using Object constructor
const data = new Object();
// data.__proto__ === Object.prototype (vulnerable)

// Inherited properties
const data = {};
console.log(data.toString); // [Function: toString] (inherited)
```

**✅ Correct**:

```typescript
// Create prototype-less object
const data = Object.create(null);
// data.__proto__ === undefined (safe)

// No inherited properties
console.log(data.toString); // undefined
console.log(data.hasOwnProperty); // undefined

// Safe to use any key
data["toString"] = "my value"; // No conflict with Object.prototype.toString
```

### Type Safety

When using TypeScript, the type should reflect the prototype-less nature:

```typescript
// Correct type annotation
const data: Record<string, string | File> = Object.create(null);
```

---

## Security Scope

For a complete understanding of what safe-formdata does and doesn't protect against, see:

- README.md: Security scope section
- AGENTS.md: Security guarantees section

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
**Last updated**: 2026-01-12
