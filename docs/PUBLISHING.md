# Publishing Process

> **For Maintainers**: This guide describes the NPM publishing workflow for safe-formdata.

safe-formdata uses an explicit, transparent publishing workflow that aligns with the library's design principles.

## Table of Contents

- [Local Validation](#local-validation)
- [Workflow Overview](#workflow-overview)
- [Why prepublishOnly was removed](#why-prepublishonly-was-removed)

---

## Local Validation

Before creating a release PR, validate locally:

```bash
bun run prepare:publish
```

This runs:

1. TypeScript type checking (`check:type:source`)
2. Test suite with coverage (`test:coverage`)
3. Build (`build`)
4. Package validation (`check:package`: publint + attw)

---

## Workflow Overview

1. **Prepare Release PR**: Bump version → Create release branch → Open PR for review
2. **Review & Merge**: Maintainer reviews and merges release PR to main
3. **Publish**: Manual trigger of publish workflow → All checks run → NPM publish

The publish workflow is defined in `.github/workflows/publish.yml` and runs the following steps:

1. Setup environment (Bun + dependencies)
2. **Validate and build package** (`bun run prepare:publish`)
3. Setup Node.js for NPM
4. Publish to NPM with provenance
5. Create and push git tag
6. Create GitHub Release (draft)

---

## Why prepublishOnly was removed

Previous versions used `npm run prepublishOnly` in package.json, which ran automatically during `npm publish`.
This violated the boundary principle: **explicit over implicit**.

The publish workflow now declares all validation steps explicitly:

- TypeScript type checking
- Test execution
- Build process
- Package validation
- NPM publication

This ensures the publishing process is **transparent** and **traceable** in the workflow file.

### Design principles alignment

| Principle                     | Implementation                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **Explicit over implicit**    | `prepare:publish` is called explicitly in the workflow, not triggered automatically |
| **Security over convenience** | All validation steps are visible and traceable                                      |
| **Boundary-focused**          | Clear separation between development and publishing processes                       |
| **No silent fixes**           | No hidden automation; every step is declared                                        |

---

## Related Files

- [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) - Publish workflow implementation
- [`package.json`](../package.json) - Package configuration and scripts
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) - Contributor guide
