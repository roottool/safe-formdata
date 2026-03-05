# Design Rules (Must Not Be Violated)

This document contains the complete design rules extracted from AGENTS.md.

These rules define the non-negotiable constraints for safe-formdata implementation.

---

## 1. Keys are opaque strings

- Do not interpret key naming conventions.
- Do not parse `[]`, `.`, or bracket notation.
- Treat keys as raw, uninterpreted strings.

### Rationale

FormData keys should be treated as opaque identifiers. Any interpretation of key structure (e.g., `user[name]` → nested object) introduces assumptions about the sender's intent, which violates the boundary principle.

### Violations

```typescript
// Parsing bracket notation
if (key.endsWith("[]")) {
  // Assumes key represents an array
}

// Parsing dot notation
const parts = key.split(".");
// Assumes key represents a nested structure

// Inferring structure from naming
if (key.includes("[") && key.includes("]")) {
  // Bracket notation parsing
}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## 2. No silent behavior

- Do not merge duplicate keys.
- Do not overwrite values.
- Do not apply first-wins or last-wins semantics.

All duplicate keys are boundary violations.

### Rationale

Silent behavior hides information from the application. If a key appears multiple times in FormData, the application must decide how to handle it. The parser's job is only to detect and report the violation, not to resolve it.

### Violations

```typescript
// Merging duplicate keys
if (data[key]) {
  data[key] = [data[key], value]; // Array merging
}

// Overwriting (last-wins)
data[key] = value; // Silently overwrites previous value

// First-wins semantics
if (!data[key]) {
  data[key] = value; // Only sets if not present
}

// Object.assign (merges)
Object.assign(data, { [key]: value });
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## 3. No inference, no convenience

- Do not infer arrays or objects.
- Do not coerce types.
- Do not validate values.
- Do not add configuration options.

Convenience features belong outside the boundary.

### Rationale

The parser's sole responsibility is to establish a predictable boundary. Inference, validation, and convenience features introduce complexity and assumptions that blur the boundary.

### Violations

```typescript
// Array inference
if (key.endsWith("[]")) {
  data[key] = data[key] || [];
  data[key].push(value);
}

// Object inference
if (key.includes(".")) {
  const [parent, child] = key.split(".");
  data[parent] = data[parent] || {};
  data[parent][child] = value;
}

// Type coercion
const numValue = Number(value);
const boolValue = value === "true";

// Value validation
if (typeof value === "string" && !isValidEmail(value)) {
  throw new Error("Invalid email");
}

// Configuration options
function parse(
  formData: FormData,
  options?: {
    allowDuplicates?: boolean;
    convertTypes?: boolean;
  },
) {}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## 4. Explicit issue reporting

- Never throw for input-derived errors.
- Always return a ParseResult with issues.
- Partial success is not allowed:
  - If issues exist, `data` must be `null`.

### Rationale

Throwing exceptions forces callers to use try-catch, which is error-prone. Returning a structured result allows applications to handle issues explicitly and predictably.

### Violations

```typescript
// Throwing exceptions
if (invalidKey) {
  throw new Error("Invalid key"); // Forces try-catch
}

// Partial success
if (issues.length > 0) {
  return {
    data: partialData, // Some keys were processed
    issues, // Some keys failed
  };
}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## Review Rule of Thumb

If a change makes the parser:

- smarter
- more convenient
- more opinionated

it likely violates the boundary.

When in doubt, reject the change.

---

**Source**: AGENTS.md (lines 36-75)
**Last updated**: 2026-03-06
