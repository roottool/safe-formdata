# Security Policy

safe-formdata is a **boundary-focused FormData parser** designed with security as a core principle.

This document defines:

- How to report security issues responsibly
- What is considered **in scope** vs **out of scope**
- The security guarantees and assumptions of this library
- How security-related issues are evaluated and handled

This policy serves as the **authoritative reference** for security-related decisions,
including issue triage and closure.

---

## Supported Versions

**Only the latest release receives security updates.**

Security fixes are not backported.
Users must upgrade to the latest version to receive security patches.

---

## Public vs Private Reporting

safe-formdata distinguishes clearly between **private vulnerability disclosure**
and **public security discussion**.

### Private (Security Advisory)

Use **GitHub Security Advisories** for:

- Reproducible vulnerabilities
- Exploit techniques or payloads
- Issues that could be actively abused
- Any report containing proof-of-concept code

👉 Report privately here:  
<https://github.com/roottool/safe-formdata/security/advisories/new>

### Public Issue

Public issues are appropriate only for:

- **Design-level security questions**
- **Non-sensitive security concerns**
- Documentation gaps or unclear guarantees
- Boundary assumptions that need clarification

**Do not include exploit code or detailed attack vectors in public issues.**

If you are unsure, **report privately first**.

---

## Reporting a Vulnerability

To report a security issue responsibly:

1. **Preferred**: Open a GitHub Security Advisory (private)
2. **Alternative**: Open a public issue with a high-level, non-sensitive description

Public issues that include sensitive details may be closed and redirected
to private reporting.

---

## Security Scope

safe-formdata establishes a **strict trust boundary** between untrusted FormData input
and application logic.

All security issues are evaluated relative to this boundary.

### In Scope (Boundary-Level Vulnerabilities)

The following are considered security vulnerabilities in safe-formdata:

- **Prototype pollution**
  - Bypassing forbidden key detection (`__proto__`, `constructor`, `prototype`)
- **Boundary violations**
  - Incorrect handling of duplicate or invalid keys that allows ambiguous or unsafe state
- **Unsafe parsing behavior**
  - Untrusted FormData crossing the boundary without explicit issue reporting
- **Data integrity violations**
  - Failure to guarantee that parsed `data` is created via `Object.create(null)`

These issues directly compromise the safety of the FormData boundary.

### Out of Scope (Not Vulnerabilities)

The following are **not** considered security vulnerabilities:

- **Application logic**
  - Value validation, business rules, authorization, or authentication
- **Framework behavior**
  - Framework-specific request parsing or integration details
- **Resource exhaustion**
  - Denial-of-service via large inputs or excessive keys
- **API misuse**
  - Incorrect usage by consumers (e.g., ignoring `issues`)

If an issue falls under these categories,  
it will be **closed without action**, even if it has security implications
at the application level.

---

## Common Misclassification

The following are **common but incorrect security reports**:

- Ignoring `issues` and using `data` anyway
- Treating parsed values as trusted without validation
- Expecting schema validation, type guarantees, or coercion
- Assuming framework-style parsing or convenience behavior

These are **application-level responsibilities**, not library vulnerabilities.

---

## Security Guarantees and Assumptions

safe-formdata provides the following **security guarantees**:

- **Forbidden keys are always detected**
  - `__proto__`, `constructor`, and `prototype` are rejected
- **No prototype chain**
  - Parsed `data` is always created with `Object.create(null)`
- **Explicit issue reporting**
  - All boundary violations are reported in `issues`
  - No silent correction or inference
- **Predictable behavior**
  - No structural inference
  - No silent merging
  - No implicit conversions

safe-formdata **assumes**:

- All input FormData is **fully untrusted**
- Consumers **must check** `issues` before using `data`
- Validation and business logic are performed **outside the boundary**

**Important**: Violating these assumptions is **not** a library vulnerability.

---

## Disclosure Policy

Security reports are handled as follows:

1. **Review**
   - Issues are evaluated against the security scope defined above
2. **Response**
   - An initial response will be provided
3. **Fix**
   - In-scope vulnerabilities are prioritized and addressed
4. **Disclosure**
   - Fixes are released with security notes in the changelog

### Breaking Changes

Security fixes **may introduce breaking changes**, including in v0.x releases,
if required to strengthen the boundary.

Security takes priority over backward compatibility.

### Public Disclosure

After a fix is released, vulnerability details may be disclosed publicly
to help the community understand and verify the fix.

---

## License

This security policy and all security-related contributions are covered
by the same [MIT License](./LICENSE) as the rest of the project.
