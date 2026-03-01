# ✅ Good Code Examples

This document shows correct implementations that follow safe-formdata's boundary principles.

---

## Complete Implementation Example

```typescript
import type { ParseResult, ParseIssue, IssueCode } from "./types";

export function parse(formData: FormData): ParseResult {
  const issues: ParseIssue[] = [];
  const data = Object.create(null); // ✅ Prototype-less object
  const seen = new Set<unknown>();

  const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"] as const;

  for (const [key, value] of formData.entries()) {
    // ✅ Validate key type and length
    if (typeof key !== "string" || key.length === 0) {
      issues.push({
        code: "invalid_key" as IssueCode,
        key,
      });
      continue;
    }

    // ✅ Check for forbidden keys (security)
    if (FORBIDDEN_KEYS.includes(key as any)) {
      issues.push({
        code: "forbidden_key" as IssueCode,
        key,
      });
      continue;
    }

    // ✅ Check for duplicate keys (no silent behavior)
    if (seen.has(key)) {
      issues.push({
        code: "duplicate_key" as IssueCode,
        key,
      });
      continue;
    }

    // ✅ Store key-value pair without inference
    seen.add(key);
    data[key] = value; // No type coercion, no transformation
  }

  // ✅ Return null data when issues exist (no partial success)
  if (issues.length > 0) {
    return { data: null, issues };
  }

  return { data, issues: [] };
}
```

---

## Key Validation (Correct)

```typescript
// ✅ Validate key as string
if (typeof key !== "string") {
  issues.push({
    code: "invalid_key",
    key,
  });
  continue;
}

// ✅ Validate non-empty key
if (key.length === 0) {
  issues.push({
    code: "invalid_key",
    key: "",
  });
  continue;
}

// ✅ Whitespace-only keys are valid (opaque strings principle)
// "   " is a valid key, even if it's just whitespace
```

---

## Security (Correct)

```typescript
// ✅ Forbidden keys check
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"] as const;

if (FORBIDDEN_KEYS.includes(key as any)) {
  issues.push({
    code: "forbidden_key",
    key,
  });
  continue; // Do not process forbidden keys
}

// ✅ Prototype-less data container
const data = Object.create(null);

// ✅ No inherited properties
console.log(data.toString); // undefined
console.log(data.hasOwnProperty); // undefined
```

---

## Duplicate Key Handling (Correct)

```typescript
// ✅ Detect duplicates using Set
const seen = new Set<unknown>();

for (const [key, value] of formData.entries()) {
  if (seen.has(key)) {
    issues.push({
      code: "duplicate_key",
      key,
    });
    continue; // Do not process duplicate
  }
  seen.add(key);
  data[key] = value;
}

// ✅ Alternative: Detect duplicates using Map
const keyCount = new Map<string, number>();

for (const [key] of formData.entries()) {
  keyCount.set(key, (keyCount.get(key) || 0) + 1);
}

for (const [key, count] of keyCount) {
  if (count > 1) {
    issues.push({
      code: "duplicate_key",
      key,
    });
  }
}
```

---

## Keys as Opaque Strings (Correct)

```typescript
// ✅ Treat keys as opaque strings, no interpretation
data[key] = value;

// ✅ Exact string comparison is fine
if (key === "specific_field_name") {
  // Special handling for a known field is OK
}

// ✅ Keys with special characters are treated as-is
data["user[name]"] = value; // Stored as literal key "user[name]"
data["user.email"] = value; // Stored as literal key "user.email"
data["items[]"] = value; // Stored as literal key "items[]"
```

---

## No Inference (Correct)

```typescript
// ✅ Store values as-is (string or File)
for (const [key, value] of formData.entries()) {
  data[key] = value; // No type checking, no coercion
}

// ✅ File and string values are both accepted
data['username'] = 'john';        // string
data['avatar'] = new File([...]);  // File
```

---

## Explicit Issue Reporting (Correct)

```typescript
// ✅ Never throw for input-derived errors
try {
  const result = parse(formData);
  // No try-catch needed
} catch (e) {
  // This will never happen for input issues
}

// ✅ Return structured result
const result = parse(formData);

if (result.data !== null) {
  // Success: process data
  console.log(result.data);
} else {
  // Failure: handle issues
  for (const issue of result.issues) {
    console.error(`Issue: ${issue.code}, Key: ${issue.key}`);
  }
}

// ✅ All-or-nothing: no partial success
if (issues.length > 0) {
  return { data: null, issues };
}
return { data, issues: [] };
```

---

## API Contract (Correct)

```typescript
// ✅ Single function signature, no overloads
export function parse(formData: FormData): ParseResult {
  // Implementation
}

// ✅ No options parameter
// NOT: parse(formData, options)

// ✅ Stable IssueCode values
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";

// ✅ ParseResult discriminated union
export type ParseResult =
  | { data: Record<string, string | File>; issues: [] }
  | { data: null; issues: ParseIssue[] };

// ✅ Type narrowing with data !== null
if (result.data !== null) {
  // TypeScript knows: data is Record, issues is []
}
```

---

## Testing (Correct)

```typescript
// ✅ Test forbidden keys
it("rejects __proto__ key", () => {
  const formData = new FormData();
  formData.append("__proto__", "malicious");

  const result = parse(formData);

  expect(result.data).toBeNull();
  expect(result.issues).toContainEqual({
    code: "forbidden_key",
    key: "__proto__",
  });
});

// ✅ Test duplicate keys
it("reports duplicate keys", () => {
  const formData = new FormData();
  formData.append("username", "john");
  formData.append("username", "jane"); // Duplicate

  const result = parse(formData);

  expect(result.data).toBeNull();
  expect(result.issues).toContainEqual({
    code: "duplicate_key",
    key: "username",
  });
});

// ✅ Test opaque keys with special characters
it("accepts keys with brackets", () => {
  const formData = new FormData();
  formData.append("items[]", "value1");

  const result = parse(formData);

  expect(result.data).not.toBeNull();
  expect(result.data?.["items[]"]).toBe("value1");
  // Key is stored as literal "items[]", not as array
});

// ✅ Test Object.create(null) usage
it("creates prototype-less object", () => {
  const formData = new FormData();
  formData.append("key", "value");

  const result = parse(formData);

  expect(result.data).not.toBeNull();
  expect(Object.getPrototypeOf(result.data)).toBeNull();
  // No toString, hasOwnProperty, etc.
});
```

---

## Type Safety (Correct)

```typescript
// ✅ Discriminated union with type narrowing
function handleResult(result: ParseResult) {
  if (result.data !== null) {
    // TypeScript knows: result.data is Record<string, string | File>
    // TypeScript knows: result.issues is []
    const username: string | File = result.data.username;

    // result.issues is [] here
    console.log(result.issues.length); // 0
  } else {
    // TypeScript knows: result.data is null
    // TypeScript knows: result.issues is ParseIssue[]
    for (const issue of result.issues) {
      console.error(issue.code);
    }
  }
}

// ✅ Type annotations on data container
const data: Record<string, string | File> = Object.create(null);

// ✅ Type annotations on issues
const issues: ParseIssue[] = [];
```

---

## JSDoc (Correct)

````typescript
/**
 * Parses FormData into a flat key-value structure.
 *
 * @param formData - The FormData object to parse
 * @returns ParseResult - Success with data, or failure with issues
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append('username', 'john');
 *
 * const result = parse(formData);
 *
 * if (result.data !== null) {
 *   console.log(result.data.username); // 'john'
 * } else {
 *   console.error(result.issues);
 * }
 * ```
 */
export function parse(formData: FormData): ParseResult {
  // Implementation
}
````

---

**These examples demonstrate correct adherence to all boundary principles.**
