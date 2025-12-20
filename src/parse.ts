import type { ParseResult, ParseIssue } from './types.js'
import { validateKey } from './validate-key.js'

/**
 * FormDataを境界重視でパースする
 *
 * @param formData - パース対象のFormData
 * @returns ParseResult（issuesがあればdataはnull）
 */
export function parse(formData: FormData): ParseResult {
  const issues: ParseIssue[] = []
  const seenKeys = new Set<string>()

  // Object.create(null) でプロトタイプ汚染を防ぐ
  const data: Record<string, string | File> = Object.create(null)

  for (const [key, value] of formData.entries()) {
    // キー検証
    const keyIssue = validateKey(key)
    if (keyIssue) {
      issues.push(keyIssue)
      continue
    }

    // 重複キー検出
    if (seenKeys.has(key)) {
      issues.push({
        code: 'duplicate_key',
        message: `Duplicate key detected: "${key}"`,
        path: [],
        meta: { key },
      })
      continue
    }

    seenKeys.add(key)
    data[key] = value
  }

  // 部分成功を許可しない: issuesがあればdataはnull
  return {
    data: issues.length > 0 ? null : data,
    issues,
  }
}
