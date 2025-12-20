import type { IssueCode } from './IssueCode.ts'

export type ParseIssue = {
  code: IssueCode
  path: string[]
  key?: unknown
}
