# ❌ Bad Code Examples

This document shows common violations of safe-formdata's boundary principles.

**These examples should NOT be used in production code.**

---

## Rule 1 Violation: Keys are Opaque Strings

### ❌ Bracket Notation Parsing

```typescript
// ❌ WRONG: Parsing [] to infer arrays
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      // Inferring array structure from key name
      const arrayKey = key.slice(0, -2);
      if (!data[arrayKey]) {
        data[arrayKey] = [];
      }
      data[arrayKey].push(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

// Problem: Treats "items[]" as special, creates array
// Violates: Keys as opaque strings
```

### ❌ Dot Notation Parsing

```typescript
// ❌ WRONG: Parsing . to create nested objects
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    const parts = key.split(".");
    let current = data;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }

  return data;
}

// Problem: Treats "user.name" as nested structure
// Violates: Keys as opaque strings
```

### ❌ PHP-Style Array Parsing

```typescript
// ❌ WRONG: Parsing PHP-style array notation
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^(.+?)\[(.+?)\]$/);

    if (match) {
      const [, parent, child] = match;
      if (!data[parent]) {
        data[parent] = {};
      }
      data[parent][child] = value;
    } else {
      data[key] = value;
    }
  }

  return data;
}

// Problem: Treats "user[name]" as nested structure
// Violates: Keys as opaque strings
```

---

## Rule 2 Violation: No Silent Behavior

### ❌ Last-Wins Semantics

```typescript
// ❌ WRONG: Silently overwrites duplicate keys
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value; // If key exists, this silently overwrites
  }

  return data;
}

// Problem: Duplicate keys are silently overwritten (last wins)
// Violates: No silent behavior
```

### ❌ First-Wins Semantics

```typescript
// ❌ WRONG: Silently ignores duplicate keys
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (!data[key]) {
      data[key] = value; // Only sets if not already present
    }
  }

  return data;
}

// Problem: Duplicate keys are silently ignored (first wins)
// Violates: No silent behavior
```

### ❌ Array Merging

```typescript
// ❌ WRONG: Merging duplicate keys into arrays
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Convert to array if duplicate
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return data;
}

// Problem: Silently resolves duplicates by creating arrays
// Violates: No silent behavior
```

### ❌ Object.assign / spread syntax

```typescript
// ❌ WRONG: Using Object.assign (merges)
function parse(formData: FormData): any {
  let data: any = {};

  for (const [key, value] of formData.entries()) {
    data = Object.assign(data, { [key]: value });
    // or: data = { ...data, [key]: value };
  }

  return data;
}

// Problem: Merges objects, overwrites duplicates silently
// Violates: No silent behavior
```

---

## Rule 3 Violation: No Inference, No Convenience

### ❌ Type Coercion

```typescript
// ❌ WRONG: Converting strings to numbers
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      // Type coercion
      const num = Number(value);
      data[key] = isNaN(num) ? value : num;
    } else {
      data[key] = value;
    }
  }

  return data;
}

// Problem: Infers types and coerces values
// Violates: No inference
```

### ❌ Boolean Conversion

```typescript
// ❌ WRONG: Converting strings to booleans
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (value === "true") {
      data[key] = true;
    } else if (value === "false") {
      data[key] = false;
    } else {
      data[key] = value;
    }
  }

  return data;
}

// Problem: Infers boolean type from string value
// Violates: No inference
```

### ❌ Value Validation

```typescript
// ❌ WRONG: Validating email format
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key.includes("email")) {
      if (!isValidEmail(value)) {
        throw new Error(`Invalid email: ${value}`);
      }
    }
    data[key] = value;
  }

  return data;
}

// Problem: Validates values (business logic)
// Violates: No inference, no convenience
```

### ❌ Configuration Options

```typescript
// ❌ WRONG: Adding options parameter
interface ParseOptions {
  allowDuplicates?: boolean;
  convertTypes?: boolean;
  strict?: boolean;
}

function parse(formData: FormData, options: ParseOptions = {}): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (options.convertTypes) {
      // Type conversion based on options
    }
    data[key] = value;
  }

  return data;
}

// Problem: Adds configuration, increases complexity
// Violates: No inference, no convenience
```

### ❌ Schema Validation

```typescript
// ❌ WRONG: Integrating with Zod for validation
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Validate against schema
  const validated = schema.parse(data);
  return validated;
}

// Problem: Adds schema validation (business logic)
// Violates: No inference, no convenience
```

---

## Rule 4 Violation: Explicit Issue Reporting

### ❌ Throwing Exceptions

```typescript
// ❌ WRONG: Throwing for invalid keys
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (key.length === 0) {
      throw new Error("Empty key not allowed");
    }

    if (key === "__proto__") {
      throw new SecurityError("Forbidden key");
    }

    data[key] = value;
  }

  return data;
}

// Problem: Throws exceptions, forces try-catch on caller
// Violates: Explicit issue reporting
```

### ❌ Partial Success

```typescript
// ❌ WRONG: Returning partial data with issues
function parse(formData: FormData): ParseResult {
  const issues: ParseIssue[] = [];
  const data = Object.create(null);

  for (const [key, value] of formData.entries()) {
    if (key === "__proto__") {
      issues.push({
        code: "forbidden_key",
        path: [],
        key,
      });
      // Problem: Continues processing other keys
    } else {
      data[key] = value;
    }
  }

  // Problem: Returns partial data even when issues exist
  return { data, issues }; // WRONG: data should be null if issues.length > 0
}

// Violates: Explicit issue reporting (no partial success)
```

### ❌ Silent Errors

```typescript
// ❌ WRONG: Silently skipping invalid keys
function parse(formData: FormData): any {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (key.length === 0) {
      continue; // Silently skips without reporting
    }

    data[key] = value;
  }

  return data; // No way to know invalid keys were found
}

// Problem: Errors are silent, no feedback to caller
// Violates: Explicit issue reporting
```

---

## Security Violations

### ❌ Plain Object (Prototype Pollution Risk)

```typescript
// ❌ WRONG: Using {} instead of Object.create(null)
function parse(formData: FormData): any {
  const data = {}; // Has Object.prototype in chain

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

// Problem: If key === '__proto__', this pollutes the prototype
// Violates: Security rules (data container)
```

### ❌ Missing Forbidden Key Check

```typescript
// ❌ WRONG: Not checking for forbidden keys
function parse(formData: FormData): ParseResult {
  const issues: ParseIssue[] = [];
  const data = Object.create(null);

  for (const [key, value] of formData.entries()) {
    if (typeof key !== "string" || key.length === 0) {
      issues.push({
        code: "invalid_key",
        path: [],
        key,
      });
      continue;
    }

    // Problem: No check for __proto__, constructor, prototype
    data[key] = value;
  }

  return issues.length > 0 ? { data: null, issues } : { data, issues: [] };
}

// Violates: Security rules (prototype safety)
```

---

## API Contract Violations

### ❌ Function Overloads

```typescript
// ❌ WRONG: Adding overloads
export function parse(formData: FormData): ParseResult;
export function parse(formData: FormData, strict: boolean): ParseResult;
export function parse(formData: FormData, strict?: boolean): ParseResult {
  // Implementation
}

// Problem: Adds complexity, violates minimal API
// Violates: API contract
```

### ❌ Adding New IssueCode (Without Major Version)

```typescript
// ❌ WRONG: Adding new issue code in minor version
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key" | "invalid_value"; // NEW - requires major version bump!

// Problem: Breaking change without major version bump
// Violates: API contract (IssueCode stability)
```

### ❌ Using `.ok` Property

```typescript
// ❌ WRONG: Adding .ok property like Result<T, E>
export type ParseResult =
  | {
      ok: true;
      data: Record<string, string | File>;
      issues: [];
    }
  | {
      ok: false;
      data: null;
      issues: ParseIssue[];
    };

// Problem: Deviates from established discriminated union pattern
// Violates: API contract (type narrowing with data !== null)
```

---

## Testing antipatterns

### ❌ Not Testing Forbidden Keys

```typescript
// ❌ WRONG: Missing security tests
it("parses basic formdata", () => {
  const formData = new FormData();
  formData.append("username", "john");

  const result = parse(formData);

  expect(result.data).toEqual({ username: "john" });
});

// Problem: No tests for __proto__, constructor, prototype
// Missing: Security test coverage
```

### ❌ Not Testing Duplicate Keys

```typescript
// ❌ WRONG: Missing duplicate key tests
it("parses formdata", () => {
  const formData = new FormData();
  formData.append("key", "value1");
  formData.append("key", "value2"); // Duplicate

  const result = parse(formData);

  // Problem: Not testing how duplicates are handled
  expect(result.data).toBeDefined();
});

// Missing: Duplicate key test coverage
```

---

**These examples violate safe-formdata's boundary principles and should be avoided.**
