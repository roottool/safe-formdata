import type { IssueCode } from "#types/IssueCode";

/**
 * Validation issue that occurred during FormData parsing.
 *
 * Each issue represents a security or validation boundary violation.
 *
 * @see {@link IssueCode} for all possible issue types
 * @see {@link https://github.com/roottool/safe-formdata#api | Issue Codes}
 */
export interface ParseIssue {
	/**
	 * Type of validation issue.
	 *
	 * - `invalid_key`: Key contains characters outside `[a-zA-Z0-9_-]`
	 * - `forbidden_key`: Key is a forbidden prototype property (e.g., `__proto__`)
	 * - `duplicate_key`: Key appears multiple times in FormData
	 *
	 * @see {@link IssueCode}
	 */
	code: IssueCode;

	/**
	 * Always an empty array (no structural inference).
	 *
	 * This field exists only for compatibility with external issue formats.
	 *
	 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md | Why path is always empty}
	 */
	path: readonly [];

	/**
	 * The field key that caused the issue (for debugging).
	 *
	 * This is the original key from FormData, even if it's invalid or forbidden.
	 *
	 * @example
	 * ```typescript
	 * {
	 *   code: 'invalid_key',
	 *   key: 'user.name',  // Contains invalid character '.'
	 *   path: []
	 * }
	 * ```
	 */
	key?: unknown;
}
