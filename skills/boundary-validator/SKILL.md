---
name: boundary-validator
description: Validates code changes against safe-formdata's boundary-focused design principles. Detects violations of "keys are opaque", "no silent behavior", "no inference", and "explicit issue reporting". Use when reviewing PRs, implementing features, or checking adherence to design rules.
license: MIT
compatibility: Designed for Claude Code (or similar products)
metadata:
  author: safe-formdata-project
  version: "1.0"
  source: Extracted from AGENTS.md
allowed-tools: Read Grep
---

# Boundary Validator

This skill validates code changes against safe-formdata's **boundary-focused design principles**.

## When to use this skill

Use this skill when:

- Creating or reviewing Pull Requests
- Implementing new features for safe-formdata
- Refactoring existing code
- Performing code reviews
- Checking adherence to design rules before committing

**Trigger keywords**: code review, PR review, check boundary, validate design, implement, refactor

## What this skill does

This skill automatically detects violations of safe-formdata's four core design rules:

1. **Keys are opaque strings** - No interpretation of key naming conventions
2. **No silent behavior** - No implicit merging or overwriting
3. **No inference, no convenience** - No structural inference or type coercion
4. **Explicit issue reporting** - Never throw for input-derived errors

## How to use this skill

### Automatic Activation

In Claude Code, this skill activates automatically when:

- You create a Pull Request
- You request a code review
- You mention "boundary rules" or "design principles"

### Manual Activation

You can explicitly invoke this skill by saying:

```
Review this code against boundary-validator rules
```

### Review Process

The skill will do the following.

1. **Read the changed files** using the Read and Grep tools
2. **Check for violations** against the four design rules
3. **Report findings** with specific line references and explanations
4. **Suggest fixes** aligned with boundary principles

## Validation Criteria

### 1. Keys are opaque strings

**Rule**: Do not interpret key naming conventions.

**Violations to detect**:

```typescript
// ❌ BAD: Parsing bracket notation
if (key.endsWith("[]")) {
  // array inference logic
}

// ❌ BAD: Parsing dot notation
if (key.includes(".")) {
  // nested object inference
}

// ❌ BAD: Interpreting key structure
const [parent, child] = key.split(".");
```

**Correct approach**:

```typescript
// ✅ GOOD: Treat keys as opaque strings
const data = Object.create(null);
data[key] = value; // No interpretation
```

**Reference**: See [design-rules.md](references/design-rules.md#1-keys-are-opaque-strings) for details.

### 2. No silent behavior

**Rule**: Do not merge duplicate keys, overwrite values, or apply first-wins/last-wins semantics.

**Violations to detect**:

```typescript
// ❌ BAD: Merging duplicate keys
Object.assign(result, newData);

// ❌ BAD: Overwriting values
data[key] = value; // if key exists, this overwrites

// ❌ BAD: First-wins logic
if (!data[key]) {
  data[key] = value;
}

// ❌ BAD: Last-wins logic
data[key] = value; // always overwrites
```

**Correct approach**:

```typescript
// ✅ GOOD: Report duplicate keys as issues
if (seen.has(key)) {
  issues.push({
    code: "duplicate_key",
    key,
  });
  // Do NOT continue processing
}
```

**Reference**: See [design-rules.md](references/design-rules.md#2-no-silent-behavior) for details.

### 3. No inference, no convenience

**Rule**: Do not infer arrays or objects, coerce types, validate values, or add configuration options.

**Violations to detect**:

```typescript
// ❌ BAD: Array inference
if (key.endsWith("[]")) {
  result[key] = [];
}

// ❌ BAD: Type coercion
const numValue = Number(value);

// ❌ BAD: Value validation
if (!isValidEmail(value)) {
  throw new Error("Invalid email");
}

// ❌ BAD: Configuration options
function parse(formData, options = {}) {
  if (options.allowDuplicates) {
    /* ... */
  }
}
```

**Correct approach**:

```typescript
// ✅ GOOD: No inference, no validation
const data = Object.create(null);
data[key] = value; // Store as-is (string or File)
```

**Reference**: See [design-rules.md](references/design-rules.md#3-no-inference-no-convenience) for details.

### 4. Explicit issue reporting

**Rule**: Never throw for input-derived errors. Always return a ParseResult with issues.

**Violations to detect**:

```typescript
// ❌ BAD: Throwing exceptions
if (invalidKey) {
  throw new Error('Invalid key');
}

// ❌ BAD: Partial success
return {
  data: partialData,  // Some keys processed
  issues: [...]       // Some keys failed
};
```

**Correct approach**:

```typescript
// ✅ GOOD: Return null data when issues exist
if (issues.length > 0) {
  return {
    data: null,
    issues,
  };
}

return {
  data,
  issues: [],
};
```

**Reference**: See [design-rules.md](references/design-rules.md#4-explicit-issue-reporting) for details.

## Additional Checks

### Security Rules

**Prototype safety**:

```typescript
// ✅ GOOD: Reject forbidden keys
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];
if (FORBIDDEN_KEYS.includes(key)) {
  issues.push({
    code: "forbidden_key",
    key,
  });
}

// ✅ GOOD: Use prototype-less objects
const data = Object.create(null); // Not {}
```

**Reference**: See [security-rules.md](references/security-rules.md) for details.

### API Contract

**IssueCode stability**

- No new IssueCode values without major version bump
- Existing codes: `invalid_key`, `forbidden_key`, `duplicate_key`

**ParseResult type**

- Must be a discriminated union
- `data !== null` for type narrowing
- No `.ok` property

**Reference**: See [api-contract.md](references/api-contract.md) for details.

## Review Output Format

When violations are found, report them in this format:

```markdown
## Boundary Validation Results

### ❌ Violations Found

#### src/parser.ts:45

**Rule**: Keys are opaque strings
**Issue**: Parsing bracket notation `[]` to infer arrays
**Code**:
\`\`\`typescript
if (key.endsWith('[]')) {
result[key.slice(0, -2)] = [];
}
\`\`\`
**Suggestion**: Remove array inference. Treat `key` as opaque string.

#### src/parser.ts:78

**Rule**: No silent behavior
**Issue**: Duplicate keys are overwritten (last-wins)
**Code**:
\`\`\`typescript
data[key] = value; // Overwrites existing key
\`\`\`
**Suggestion**: Check for duplicates and report as `duplicate_key` issue.

### ✅ Design Principles Followed

- ✅ Uses `Object.create(null)` for data container
- ✅ Reports forbidden keys (`__proto__`, `constructor`, `prototype`)
- ✅ Returns ParseResult with `data: null` when issues exist
```

## File References

For detailed rules and patterns, see:

- [design-rules.md](references/design-rules.md) - Complete design rules from AGENTS.md
- [security-rules.md](references/security-rules.md) - Security implementation requirements
- [api-contract.md](references/api-contract.md) - API stability constraints
- [validation-patterns.md](references/validation-patterns.md) - Concrete violation patterns

## Examples

See the `examples/` directory for:

- [good-code.md](examples/good-code.md) - ✅ Correct implementations
- [bad-code.md](examples/bad-code.md) - ❌ Common violations

## Important Notes

### Scope

This skill validates **implementation code** (e.g., `src/parse.ts`), not:

- Tests (though test logic should also follow principles)
- Documentation
- Configuration files

### Non-Goals

Do **not** flag these as violations:

- Performance optimizations (unless they compromise correctness)
- Code style preferences (use linter for that)
- Feature requests that are out of scope (those are design discussions, not violations)

### Philosophy

The boundary-focused approach prioritizes:

1. **Correctness** over convenience
2. **Explicitness** over inference
3. **Stability** over features

When in doubt, consult [AGENTS.md](../../AGENTS.md) section "Review rule of thumb":

> If a change makes the parser smarter, more convenient, or more opinionated, it likely violates the boundary.

## Limitations

- **Context required**: This skill needs to read source code files
- **Human judgment**: Final decision on edge cases remains with humans
- **False positives**: Some patterns may be flagged incorrectly - use judgment

## Versioning

This skill follows AGENTS.md. When AGENTS.md is updated:

1. Update the corresponding reference files in `references/`
2. Increment the `metadata.version` in this frontmatter
3. Test with actual code reviews

---

**Current version**: 1.0
**Source**: Extracted from [AGENTS.md](../../AGENTS.md)
**License**: MIT (see [LICENSE.txt](LICENSE.txt))
