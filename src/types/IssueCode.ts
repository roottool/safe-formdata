/**
 * Type of validation issue detected during FormData parsing.
 *
 * All issue codes represent security boundaries enforced by safe-formdata:
 *
 * - **`invalid_key`**: Key contains characters outside `[a-zA-Z0-9_-]`.
 *   Prevents injection attacks and ensures predictable field names.
 *
 * - **`forbidden_key`**: Key is a forbidden prototype property
 *   (`__proto__`, `constructor`, `prototype`).
 *   Prevents prototype pollution attacks.
 *
 * - **`duplicate_key`**: Key appears multiple times in FormData.
 *   Prevents ambiguity about which value should be used.
 *
 * @see {@link https://github.com/roottool/safe-formdata#api | API Documentation}
 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md | Implementation Rules}
 *
 * @example
 * ```typescript
 * import { parse } from 'safe-formdata';
 *
 * const formData = new FormData();
 * formData.append('__proto__', 'polluted');
 *
 * const result = parse(formData);
 *
 * if (result.data === null) {
 *   const issue = result.issues[0];
 *   console.log(issue.code); // 'forbidden_key'
 * }
 * ```
 */
export type IssueCode = "invalid_key" | "forbidden_key" | "duplicate_key";
