import type { ParseIssue } from '../types/ParseIssue.js'
import type { IssueCode } from '../types/IssueCode.js'

/**
 * Payload for creating a ParseIssue.
 *
 * @property key - The problematic key that triggered the issue (for debugging)
 */
interface IssuePayload {
  key?: unknown
}

/**
 * Creates a ParseIssue with the specified code and optional payload.
 *
 * This is an internal utility function for generating structured issue reports
 * during FormData parsing. All issues have an empty `path` array, as this parser
 * does not infer structural relationships.
 *
 * @param code - The type of issue (invalid_key, forbidden_key, or duplicate_key)
 * @param payload - Optional payload containing the problematic key
 * @returns A ParseIssue object ready to be added to the issues array
 *
 * @internal
 */
export function createIssue(
  code: IssueCode,
  payload: IssuePayload
): ParseIssue {
  return {
    code,
    path: [],
    ...payload,
  }
}
