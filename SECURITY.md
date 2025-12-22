# Security Policy

safe-formdata is a **boundary-focused FormData parser** designed with security as a core principle.

This document explains:

- How to report security vulnerabilities
- What is considered in scope vs out of scope
- The security guarantees and design assumptions of this library

---

## Supported Versions

**Only the latest release receives security updates.**

Security fixes are not backported to previous versions. Users should upgrade to the latest version to receive security patches.

---

## Reporting a Vulnerability

If you discover a security vulnerability in safe-formdata, please report it responsibly:

1. **Preferred**: [Open a GitHub Security Advisory](https://github.com/roottool/safe-formdata/security/advisories/new)
2. **Alternative**: Open a public issue with a clear, non-sensitive description

**Important**: Do **not** include exploit code or detailed attack vectors in public issues. Use Security Advisories for sensitive disclosures.

---

## Security Scope

safe-formdata establishes a **strict boundary** between untrusted FormData input and application logic. The security scope is defined by this boundary.

### In scope

Issues within the parsing boundary are considered security vulnerabilities:

- **Prototype pollution**: Bypassing forbidden key detection (`__proto__`, `constructor`, `prototype`)
- **Boundary violations**: Incorrect handling of duplicate or invalid keys that allows ambiguous or unsafe state
- **Unsafe parsing**: Any behavior that allows untrusted FormData to cross the boundary without proper issue reporting
- **Data integrity**: Violations of the guarantee that `data` uses `Object.create(null)`

### Out of scope

Issues outside the parsing boundary are **not** considered security vulnerabilities:

- **Application logic**: Value validation, business rules, or authorization checks
- **Framework behavior**: Framework-specific integration or request handling
- **Resource exhaustion**: Denial-of-service via large inputs or excessive keys
- **API misuse**: Incorrect usage of the library by consumers (e.g., ignoring `issues`)

These concerns belong to the application layer, outside the FormData parsing boundary.

---

## Security Guarantees and Assumptions

safe-formdata provides the following **security guarantees**:

- **Forbidden keys are rejected**: `__proto__`, `constructor`, and `prototype` are always detected and reported
- **No prototype chain**: Parsed `data` is always created with `Object.create(null)`
- **Explicit issue reporting**: All boundary violations are reported in `issues`; nothing is silently corrected
- **Predictable behavior**: No structural inference, no silent merging, no implicit conversions

safe-formdata **assumes**:

- Input FormData is **fully untrusted**
- Consumers **must check** `issues` before using `data`
- Value validation and business logic are performed **outside the parsing boundary**

**Important**: Violations of these assumptions (e.g., ignoring `issues`, not validating values) are **not** library vulnerabilities—they are application-level security issues.

---

## Disclosure Policy

Security reports are handled as follows:

1. **Review**: Issues are evaluated against the security scope defined above
2. **Response**: You will receive an initial response
3. **Fix timeline**: In-scope vulnerabilities will be prioritized and addressed promptly
4. **Disclosure**: Fixes will be released with security notes in the changelog

### Breaking changes

Security fixes **may introduce breaking changes** in v0.x releases if required to strengthen the boundary. The project prioritizes security over backward compatibility.

### Public disclosure

Once a fix is released, the vulnerability details may be disclosed publicly to help the community understand the issue and verify the fix.

---

## License

This security policy and all security-related contributions are covered by the same [MIT License](./LICENSE) as the rest of the project.
