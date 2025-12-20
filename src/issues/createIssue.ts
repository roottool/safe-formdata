import type { ParseIssue } from '../types/ParseIssue.js'
import type { IssueCode } from '../types/IssueCode.js'

export function createIssue(
  code: IssueCode,
  payload: Record<string, unknown>
): ParseIssue {
  return {
    code,
    path: [],
    ...payload,
  }
}
