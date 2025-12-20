import { FORBIDDEN_KEYS } from './issues/forbiddenKeys'
import { createIssue } from './issues/createIssue'
import type { ParseResult } from './types/ParseResult'

export function parse(formData: FormData): ParseResult {
  const data = Object.create(null) as Record<string, string | File>
  const issues = []
  const seenKeys = new Set<string>()

  for (const [key, value] of formData.entries()) {
    if (typeof key !== 'string' || key.length === 0) {
      issues.push(
        createIssue('invalid_key', { key })
      )
      continue
    }

    if (FORBIDDEN_KEYS.has(key)) {
      issues.push(
        createIssue('forbidden_key', { key })
      )
      continue
    }

    if (seenKeys.has(key)) {
      issues.push(
        createIssue('duplicate_key', { key })
      )
      continue
    }

    seenKeys.add(key)
    data[key] = value
  }

  if (issues.length > 0) {
    return {
      data: null,
      issues,
    }
  }

  return {
    data,
    issues: [],
  }
}
