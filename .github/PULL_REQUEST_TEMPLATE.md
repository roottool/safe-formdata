## Description

<!-- What does this PR change? Keep it concise. -->

## Type of Change

- [ ] Bugfix (non-breaking change fixing an issue)
- [ ] Security fix (non-breaking change addressing a security issue)
- [ ] Documentation (changes to documentation only)
- [ ] Refactoring (non-breaking change improving code structure)
- [ ] Tests (adding or updating tests)
- [ ] Tooling / CI (changes to build tools, CI configuration)

## Boundary Checklist (Required for Implementation Changes)

> safe-formdata enforces a **strict trust boundary** for FormData.
> If any item below does **not** apply, this change likely does not belong here.
>
> **For documentation, tooling, or CI changes**: You may skip this section by checking the box below and explaining why.

- [ ] **This is a non-implementation change** (Documentation, Tooling, or CI only)
  - Reason: <!-- Explain why boundary checklist doesn't apply -->

**For implementation changes, verify all items below:**

- [ ] **No interpretation**
  - Key names are treated as opaque strings
  - No structural inference (`[]`, `.`, brackets, paths, etc.)
- [ ] **No silent behavior**
  - No merging, overwriting, autofixing, or implicit resolution
  - All boundary violations are reported explicitly
- [ ] **Boundary respected**
  - No validation, coercion, schema, framework conventions, or business logic

📘 Boundary rules & non-goals:
<https://github.com/roottool/safe-formdata/blob/main/AGENTS.md>

## Security & API Stability

### Security Impact

- [ ] No impact on security (no changes to forbidden keys, prototype safety)
- [ ] Reviewed against security rules in AGENTS.md
- [ ] If security-related: Explain impact and mitigation

### API Contract

- [ ] No changes to public API (`parse` function signature, type definitions)
- [ ] No breaking changes to `ParseResult`, `ParseIssue`, or `IssueCode`
- [ ] If API change: Is this a breaking change? (Yes/No + explanation)

### Versioning

- [ ] Change is compatible with current v0.x versioning policy
- [ ] If breaking change proposed: Justification for major version bump

## Testing

### Automated Checks

- [ ] TypeScript type checking passes (`bun run check:type:source`)
- [ ] All tests pass (`bun run test`)
- [ ] Build succeeds (`bun run build`)

### Additional Verification

(describe any manual testing, edge case verification, or integration testing)

<!-- Describe tests added, updated, or manual verification performed. If none, explain why. -->

## Automated Review (Optional)

**For Claude Code users**: You can use the boundary-validator skill for automated review:

```text
Review this code against boundary-validator rules
```

**For other tools**: Reference [AGENTS.md](https://github.com/roottool/safe-formdata/blob/main/AGENTS.md) and [skills/boundary-validator](https://github.com/roottool/safe-formdata/tree/main/skills/boundary-validator) for design rules.
