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
	 * - `invalid_key`: Key is empty or not a string
	 * - `forbidden_key`: Key is a forbidden prototype property (e.g., `__proto__`)
	 * - `duplicate_key`: Key appears multiple times in FormData
	 *
	 * @see {@link IssueCode}
	 */
	code: IssueCode;

	/**
	 * The field key that caused the issue.
	 *
	 * This is the original key from FormData, reported as-is without interpretation.
	 */
	key: string;
}
