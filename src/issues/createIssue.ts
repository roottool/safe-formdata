// src/issues/createIssue.ts

import type { ParseIssue } from '../types/ParseIssue'
import type { IssueCode } from '../types/IssueCode'

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
