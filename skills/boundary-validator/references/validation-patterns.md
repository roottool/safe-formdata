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

#### Pattern: Bracket Notation Parsing

```typescript
// ❌ Violation: Parsing [] for arrays
if (key.endsWith("[]")) {
  /* ... */
}
if (key.includes("[]")) {
  /* ... */
}
key.slice(0, -2); // Removing []

// ❌ Violation: Parsing [index] for arrays
const match = key.match(/\[(\d+)\]/);
key.replace(/\[\d+\]/, "");

// ❌ Violation: Parsing [name] for nested objects
const match = key.match(/\[(\w+)\]/);
if (key.includes("[") && key.includes("]")) {
  /* ... */
}
```

#### Pattern: Dot Notation Parsing

```typescript
// ❌ Violation: Parsing . for nested objects
if (key.includes(".")) {
  /* ... */
}
const parts = key.split(".");
const [parent, child] = key.split(".");

// ❌ Violation: Path parsing
key.split(".").reduce((obj, part) => obj[part], root);
```

#### Pattern: Special Character Interpretation

```typescript
// ❌ Violation: Treating special characters as delimiters
key.split(/[.\[\]]/);
key.replace(/[\[\]\.]/g, "");
```

### Correct Patterns

```typescript
// ✅ Correct: Keys as opaque strings
const data = Object.create(null);
data[key] = value; // No interpretation

// ✅ Correct: String comparison without parsing
if (key === "exact_key_name") {
  /* ... */
}
```

---

## Rule 2: No Silent Behavior

### Antipatterns to Detect

#### Pattern: Merge/Overwrite

```typescript
// ❌ Violation: Object.assign (merges)
Object.assign(data, { [key]: value });
Object.assign(data, newData);

// ❌ Violation: Spread operator (merges)
data = { ...data, [key]: value };
data = { ...data, ...newData };

// ❌ Violation: Direct overwrite without checking
data[key] = value; // If key exists, this silently overwrites
```

#### Pattern: Array Accumulation

```typescript
// ❌ Violation: Converting to array for duplicates
if (data[key]) {
  data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
}

// ❌ Violation: Array push
if (!data[key]) data[key] = [];
data[key].push(value);
```

#### Pattern: First-Wins / Last-Wins

```typescript
// ❌ Violation: First-wins semantics
if (!data[key]) {
  data[key] = value;
}
if (data[key] === undefined) {
  data[key] = value;
}

// ❌ Violation: Last-wins (implicit in direct assignment)
data[key] = value; // Always overwrites
```

### Correct Patterns

```typescript
// ✅ Correct: Detect and report duplicates
const seen = new Set<unknown>();

for (const [key, value] of formData.entries()) {
  if (seen.has(key)) {
    issues.push({
      code: "duplicate_key",
      path: [],
      key,
    });
    continue; // Do not process
  }
  seen.add(key);
  data[key] = value;
}
```

---

## Rule 3: No Inference, No Convenience

### Antipatterns to Detect

#### Pattern: Structural Inference

```typescript
// ❌ Violation: Creating nested objects
const parts = key.split(".");
let current = data;
for (const part of parts) {
  current[part] = current[part] || {};
  current = current[part];
}

// ❌ Violation: Array creation based on key pattern
if (key.endsWith("[]")) {
  data[key] = [];
}
```

#### Pattern: Type Coercion

```typescript
// ❌ Violation: Converting to number
const numValue = Number(value);
const numValue = parseInt(value);
const numValue = +value;

// ❌ Violation: Converting to boolean
const boolValue = value === "true";
const boolValue = Boolean(value);
const boolValue = !!value;

// ❌ Violation: Date parsing
const dateValue = new Date(value);
const dateValue = Date.parse(value);
```

#### Pattern: Value Validation

```typescript
// ❌ Violation: Validating email format
if (!isValidEmail(value)) {
  throw new Error("Invalid email");
}

// ❌ Violation: Validating required fields
if (!value || value.length === 0) {
  throw new Error("Field is required");
}

// ❌ Violation: Schema validation
const schema = z.object({
  /* ... */
});
schema.parse(data);
```

#### Pattern: Configuration Options

```typescript
// ❌ Violation: Adding options parameter
function parse(
  formData: FormData,
  options?: {
    allowDuplicates?: boolean;
    convertTypes?: boolean;
    strict?: boolean;
  },
): ParseResult {
  /* ... */
}

// ❌ Violation: Using options internally
if (options?.allowDuplicates) {
  // Different behavior based on options
}
```

### Correct Patterns

```typescript
// ✅ Correct: No inference, store values as-is
const data = Object.create(null);
for (const [key, value] of formData.entries()) {
  data[key] = value; // Store string or File as-is
}

// ✅ Correct: No options, single signature
export function parse(formData: FormData): ParseResult {
  // Implementation
}
```

---

## Rule 4: Explicit Issue Reporting

### Antipatterns to Detect

#### Pattern: Throwing Exceptions

```typescript
// ❌ Violation: throw for input-derived errors
if (invalidKey) {
  throw new Error("Invalid key");
}

if (forbiddenKey) {
  throw new SecurityError("Forbidden key");
}

if (duplicateKey) {
  throw new DuplicateKeyError();
}

// ❌ Violation: throw inside loop
for (const [key, value] of formData.entries()) {
  if (someCondition) {
    throw new Error(); // Forces try-catch on caller
  }
}
```

#### Pattern: Partial Success

```typescript
// ❌ Violation: Returning partial data with issues
return {
  data: partialData, // Some keys processed
  issues: [...]      // Some keys failed
};

// ❌ Violation: Allowing issues.length > 0 with non-null data
if (issues.length > 0) {
  return { data, issues }; // WRONG: data should be null
}
```

### Correct Patterns

```typescript
// ✅ Correct: Collect issues, return structured result
const issues: ParseIssue[] = [];
const data = Object.create(null);

for (const [key, value] of formData.entries()) {
  if (invalidCondition) {
    issues.push({
      code: "invalid_key",
      path: [],
      key,
    });
    continue; // Do not throw
  }

  data[key] = value;
}

// ✅ Correct: All-or-nothing based on issues
if (issues.length > 0) {
  return { data: null, issues };
}

return { data, issues: [] };
```

---

## Security-Specific Patterns

### Antipatterns to Detect

#### Pattern: Unsafe Object Creation

```typescript
// ❌ Violation: Using plain object literal
const data = {};
const data = new Object();

// ❌ Violation: Not checking for forbidden keys before assignment
for (const [key, value] of formData.entries()) {
  data[key] = value; // Dangerous if key === '__proto__'
}
```

#### Pattern: Missing Forbidden Key Check

```typescript
// ❌ Violation: No forbidden key validation
for (const [key, value] of formData.entries()) {
  if (typeof key !== "string" || key.length === 0) {
    // Invalid key check
  }
  // Missing: forbidden key check for __proto__, constructor, prototype
  data[key] = value;
}
```

### Correct Patterns

```typescript
// ✅ Correct: Prototype-less object
const data = Object.create(null);

// ✅ Correct: Check for forbidden keys
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];

for (const [key, value] of formData.entries()) {
  if (FORBIDDEN_KEYS.includes(key as any)) {
    issues.push({
      code: "forbidden_key",
      path: [],
      key,
    });
    continue;
  }

  data[key] = value;
}
```

---

## API Contract Patterns

### Antipatterns to Detect

#### Pattern: Function Overloads

```typescript
// ❌ Violation: Adding overloads
export function parse(formData: FormData): ParseResult;
export function parse(formData: FormData, strict: boolean): ParseResult;
```

#### Pattern: Changing IssueCode

```typescript
// ❌ Violation: Adding new issue codes without major version bump
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key" | "invalid_value"; // NEW CODE - requires major version!
```

### Correct Patterns

```typescript
// ✅ Correct: Single function signature
export function parse(formData: FormData): ParseResult {
  // Implementation
}

// ✅ Correct: Stable IssueCode (v0.x)
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";
```

---

## Grep Commands for Detection

Use these commands to search for violations:

```bash
# Search for bracket notation parsing
grep -r "endsWith\('\[\]'\)" src/
grep -r "includes\('\[\]'\)" src/
grep -r "match.*\\\[" src/

# Search for dot notation parsing
grep -r "split\('\.'\)" src/
grep -r "includes\('\.'\)" src/

# Search for Object.assign or spread
grep -r "Object\.assign" src/
grep -r "\.\.\." src/

# Search for throw statements
grep -r "throw new" src/
grep -r "throw " src/

# Search for type coercion
grep -r "Number(" src/
grep -r "Boolean(" src/
grep -r "parseInt" src/

# Search for plain object creation
grep -r "= {}" src/
grep -r "new Object()" src/

# Search for configuration options
grep -r "options\?" src/
grep -r "ParseOptions" src/
```

---

**Last updated**: 2026-01-12
