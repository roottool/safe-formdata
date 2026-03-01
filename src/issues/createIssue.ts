import type { IssueCode } from "#types/IssueCode";
import type { ParseIssue } from "#types/ParseIssue";

/**
 * Creates a ParseIssue with the specified code and key.
 *
 * This is an internal utility function for generating structured issue reports
 * during FormData parsing.
 *
 * @param code - The type of issue (invalid_key, forbidden_key, or duplicate_key)
 * @param key - The FormData key that caused the issue
 * @returns A ParseIssue object ready to be added to the issues array
 *
 * @internal
 */
export function createIssue(code: IssueCode, key: string): ParseIssue {
	return { code, key };
}
