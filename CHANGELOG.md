# Changelog

This project uses GitHub Releases as the single source of truth for all changes.

For the full and authoritative change history, including breaking changes and migration notes,
please see: <https://github.com/roottool/safe-formdata/releases>

Migration guides for breaking changes are maintained below.

---

## [Unreleased]

> **Breaking changes** — In the 0.x series, minor version bumps are treated as effectively major releases.

### `ParseIssue.path` removed

The `path` field has been removed from `ParseIssue`.

```ts
// v0.1.x
interface ParseIssue {
  code: IssueCode;
  path: readonly []; // removed
}

// v0.2.0
interface ParseIssue {
  code: IssueCode;
  key: string; // added (see below)
}
```

**Migration**: Remove all references to `issue.path`. Because `path` was always an empty array, any reference to it was effectively a no-op and can be deleted outright.

### `ParseIssue.key` added (required, `string`)

A required `key: string` field has been added to identify which FormData key caused the issue.

```ts
// v0.1.x — no key field
issue.code; // "forbidden_key"

// v0.2.0 — key identifies the offending field
issue.code; // "forbidden_key"
issue.key; // "__proto__"
```

**Migration**: Use `issue.key` wherever you need to identify the offending field. This is an additive change with no runtime impact, but type definitions that reference `ParseIssue` must be updated.

### `issues` on failure narrowed to a non-empty tuple

```ts
// v0.1.x
issues: ParseIssue[]

// v0.2.0
issues: [ParseIssue, ...ParseIssue[]]
```

When parsing fails (`data === null`), the type now guarantees at least one issue is present.

**Migration**: Accessing `result.issues[0]` remains safe. No changes to narrowing logic are required. However, if you reference the `ParseResult` type explicitly, you may need to update type annotations.
