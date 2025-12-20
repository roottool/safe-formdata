import type { IssueCode } from './IssueCode'

export type ParseIssue = {
  code: IssueCode
  path: string[]
  key?: unknown
}
