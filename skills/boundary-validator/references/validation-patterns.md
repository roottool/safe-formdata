# Validation Patterns

This document provides concrete code patterns for detecting boundary violations.

Use these patterns when reviewing code changes to safe-formdata.

---

## Detection Strategy

When reviewing code, search for these antipatterns.

1. **Keyword search**: Look for suspicious method calls and operators
2. **Control flow analysis**: Examine conditional logic related to keys
3. **Data structure inspection**: Check how the data container is created

---

## Rule 1: Keys are Opaque Strings

### Antipatterns to Detect

```typescript
// ❌ Parsing bracket notation
if (key.endsWith("[]")) {
  /* ... */
}
key.slice(0, -2);
const match = key.match(/\[(\d+)\]/);

// ❌ Parsing dot notation
if (key.includes(".")) {
  /* ... */
}
const parts = key.split(".");

// ❌ Special character interpretation
key.split(/[.\[\]]/);
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## Rule 2: No Silent Behavior

### Antipatterns to Detect

```typescript
// ❌ Merge / overwrite
Object.assign(data, { [key]: value });
data = { ...data, [key]: value };
data[key] = value; // without duplicate check

// ❌ Array accumulation
if (data[key]) {
  data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
}

// ❌ First-wins / last-wins
if (!data[key]) {
  data[key] = value;
}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## Rule 3: No Inference, No Convenience

### Antipatterns to Detect

```typescript
// ❌ Structural inference
const parts = key.split(".");
let current = data;
for (const part of parts) {
  current = current[part] = current[part] || {};
}

// ❌ Type coercion
const numValue = Number(value);
const boolValue = value === "true";

// ❌ Configuration options
function parse(formData: FormData, options?: { allowDuplicates?: boolean }): ParseResult {}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## Rule 4: Explicit Issue Reporting

### Antipatterns to Detect

```typescript
// ❌ Throwing
if (invalidKey) { throw new Error("Invalid key"); }

// ❌ Partial success
return { data: partialData, issues: [...] };
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## Security-Specific Patterns

### Antipatterns to Detect

```typescript
// ❌ Unsafe object creation
const data = {};
const data = new Object();

// ❌ Missing forbidden key check
for (const [key, value] of formData.entries()) {
  // No __proto__ / constructor / prototype check
  data[key] = value;
}
```

See correct implementation: [`src/parse.ts`](../../../src/parse.ts)

---

## API Contract Patterns

### Antipatterns to Detect

```typescript
// ❌ Function overloads
export function parse(formData: FormData): ParseResult;
export function parse(formData: FormData, strict: boolean): ParseResult;

// ❌ New IssueCode without major version bump
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key" | "invalid_value";
```

See correct types: [`src/types/`](../../../src/types/)

---

## Grep Commands for Detection

```bash
# Bracket notation parsing
grep -r "endsWith\('\[\]'\)" src/
grep -r "includes\('\[\]'\)" src/
grep -r "match.*\\\[" src/

# Dot notation parsing
grep -r "split\('\.'\)" src/
grep -r "includes\('\.'\)" src/

# Object.assign or spread
grep -r "Object\.assign" src/
grep -r "\.\.\." src/

# Throw statements
grep -r "throw new" src/
grep -r "throw " src/

# Type coercion
grep -r "Number(" src/
grep -r "Boolean(" src/
grep -r "parseInt" src/

# Unsafe object creation
grep -r "= {}" src/
grep -r "new Object()" src/

# Configuration options
grep -r "options\?" src/
grep -r "ParseOptions" src/
```

---

**Last updated**: 2026-03-06
