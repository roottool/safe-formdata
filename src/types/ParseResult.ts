import type { ParseIssue } from "#types/ParseIssue";

/**
 * Result of parsing FormData with {@link parse}.
 *
 * This is a discriminated union type. Use `data !== null` to narrow the type:
 * - `data !== null` → Success: parsed data available, issues is empty array
 * - `data === null` → Failure: validation issues occurred
 *
 * @example
 * ```typescript
 * import { parse } from 'safe-formdata';
 *
 * const result = parse(formData);
 *
 * if (result.data !== null) {
 *   // Success: result.data is Record<string, string | File>
 *   console.log(result.data.username);
 * } else {
 *   // Failure: result.issues contains validation errors
 *   console.error(result.issues);
 * }
 * ```
 *
 * @see {@link https://github.com/roottool/safe-formdata#api | API Documentation}
 */
export type ParseResult =
	| {
			/**
			 * Parsed FormData as a prototype-safe object.
			 *
			 * Properties:
			 * - Created with `Object.create(null)` to prevent prototype pollution
			 * - All values are `string | File` (no automatic type conversion)
			 * - Flat structure (no nested objects or arrays)
			 *
			 * Only present when `issues` is empty.
			 *
			 * @example
			 * ```typescript
			 * if (result.data !== null) {
			 *   const username = result.data.username; // string | File
			 *
			 *   // Type narrowing is your responsibility
			 *   if (typeof username === 'string') {
			 *     console.log(username.toUpperCase());
			 *   }
			 * }
			 * ```
			 */
			data: Record<string, string | File>;

			/**
			 * Empty array when parsing succeeds.
			 */
			issues: [];
	  }
	| {
			/**
			 * Null when validation issues occurred.
			 *
			 * Use `data !== null` to narrow the type and access parsed data.
			 */
			data: null;

			/**
			 * Array of validation issues that prevented successful parsing.
			 *
			 * Possible issue codes:
			 * - `invalid_key`: Key contains unsafe characters
			 * - `forbidden_key`: Key is a forbidden prototype property
			 * - `duplicate_key`: Key appears multiple times
			 *
			 * @see {@link ParseIssue}
			 * @see {@link https://github.com/roottool/safe-formdata#security-scope | Security Scope}
			 *
			 * @example
			 * ```typescript
			 * if (result.data === null) {
			 *   result.issues.forEach(issue => {
			 *     console.error(`${issue.code}: ${issue.key}`);
			 *   });
			 * }
			 * ```
			 */
			issues: ParseIssue[];
	  };
