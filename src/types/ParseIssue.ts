import type { IssueCode } from '#types/IssueCode'

export type ParseIssue = {
  code: IssueCode
  path: string[]
  key?: unknown
}
