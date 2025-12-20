import type { ParseIssue } from './ParseIssue.ts'

export type ParseResult =
  | {
      data: Record<string, string | File>
      issues: []
    }
  | {
      data: null
      issues: ParseIssue[]
    }
