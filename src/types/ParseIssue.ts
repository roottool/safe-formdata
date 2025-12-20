import type { IssueCode } from '#types/IssueCode'

export interface ParseIssue {
  code: IssueCode
  path: readonly []
  key?: unknown
}
