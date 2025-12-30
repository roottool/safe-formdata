## Description

<!-- What does this PR change? Keep it concise. -->

## Boundary Checklist (Required)

> safe-formdata enforces a **strict trust boundary** for FormData.
> If any item below does **not** apply, this change likely does not belong here.

- [ ] **No interpretation**
  - Key names are treated as opaque strings
  - No structural inference (`[]`, `.`, brackets, paths, etc.)
- [ ] **No silent behavior**
  - No merging, overwriting, auto-fixing, or implicit resolution
  - All boundary violations are reported explicitly
- [ ] **Boundary respected**
  - No validation, coercion, schema, framework conventions, or business logic

📘 Boundary rules & non-goals:  
<https://github.com/roottool/safe-formdata/blob/main/AGENTS.md>

## Type of Change

- [ ] Bug fix
- [ ] Security fix
- [ ] Documentation
- [ ] Refactoring (no behavior change)
- [ ] Tests
- [ ] Tooling / CI

## Testing

<!-- Describe tests added or updated. If none, explain why. -->
