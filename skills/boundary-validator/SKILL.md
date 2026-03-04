---
name: boundary-validator
description: Validates code changes against safe-formdata's boundary-focused design principles. Detects violations of "keys are opaque", "no silent behavior", "no inference", and "explicit issue reporting". Use when reviewing PRs, implementing features, or checking adherence to design rules.
---

# Boundary Validator

## Review Process

1. Read the changed files using the Read and Grep tools
2. Check for violations against the four design rules
3. Report findings with specific line references and explanations
4. Suggest fixes aligned with boundary principles

## Validation Criteria

For violation patterns and examples, see [design-rules.md](references/design-rules.md).

### 1. Keys are opaque strings

Do not interpret key naming conventions (`[]`, `.`, `_`, etc.). Store keys as-is.

### 2. No silent behavior

Do not merge duplicate keys, overwrite values, or apply first-wins/last-wins semantics. Report duplicates as `duplicate_key` issues.

### 3. No inference, no convenience

Do not infer arrays or objects, coerce types, validate values, or add configuration options.

### 4. Explicit issue reporting

Never throw for input-derived errors. Return `{ data: null, issues }` when any issue exists.

## Additional Checks

**Security**: Reject `__proto__`, `constructor`, `prototype` as `forbidden_key`. Use `Object.create(null)` for data. See [security-rules.md](references/security-rules.md).

**API contract**: No new `IssueCode` values without major version bump. `ParseResult` must be a discriminated union; use `data !== null` for type narrowing. No `.ok` property. See [api-contract.md](references/api-contract.md).

## Review Output Format

When violations are found, report findings in this format:

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

### ✅ Design Principles Followed

- ✅ Uses `Object.create(null)` for data container
- ✅ Reports forbidden keys (`__proto__`, `constructor`, `prototype`)
- ✅ Returns ParseResult with `data: null` when issues exist
```

## Scope

Validates **implementation code** (e.g., `src/parse.ts`). Does not flag:

- Tests, documentation, or configuration files
- Performance optimizations (unless they compromise correctness)
- Code style preferences (use linter)
- Out-of-scope feature requests (design discussions, not violations)

## File References

- [design-rules.md](references/design-rules.md) - Complete design rules from AGENTS.md
- [security-rules.md](references/security-rules.md) - Security implementation requirements
- [api-contract.md](references/api-contract.md) - API stability constraints
- [validation-patterns.md](references/validation-patterns.md) - Concrete violation patterns
