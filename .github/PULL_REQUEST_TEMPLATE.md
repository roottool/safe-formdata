## Description

<!-- What does this PR change? Keep it concise. -->

## Type of Change

- [ ] Bugfix (non-breaking change fixing an issue)
- [ ] Security fix (non-breaking change addressing a security issue)
- [ ] Documentation (changes to documentation only)
- [ ] Refactoring (non-breaking change improving code structure)
- [ ] Tests (adding or updating tests)
- [ ] Tooling / CI (changes to build tools, CI configuration)

## Boundary Checklist

- [ ] **This is a non-implementation change** (Documentation, Tooling, or CI only)
- [ ] **No interpretation** — Keys treated as opaque strings, no structural inference
- [ ] **No silent behavior** — No merging, overwriting, or implicit resolution
- [ ] **Boundary respected** — No validation, coercion, or business logic

📘 [AGENTS.md](https://github.com/roottool/safe-formdata/blob/main/AGENTS.md)

## Security & API Stability

- [ ] No security impact (forbidden keys, prototype safety unaffected)
- [ ] No changes to public API (`parse`, `ParseResult`, `ParseIssue`, `IssueCode`)
- [ ] No breaking changes; or justified with version bump rationale
- [ ] Compatible with current v0.x versioning policy

## Testing

- [ ] `bun run check:type:source` passes
- [ ] `bun run test` passes
- [ ] `bun run build` passes

<!-- Manual testing or edge cases (if any): -->
