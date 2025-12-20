import { FORBIDDEN_KEYS } from './constants.js'
import type { ParseIssue } from './types.js'

/**
 * キーが有効かどうかを検証し、問題があればissueを返す
 *
 * @param key - 検証対象のキー
 * @returns 問題があればParseIssue、なければnull
 */
export function validateKey(key: string): ParseIssue | null {
  // 1. forbidden_key チェック
  if (FORBIDDEN_KEYS.includes(key as never)) {
    return {
      code: 'forbidden_key',
      message: `Forbidden key detected: "${key}"`,
      path: [],
      meta: { key },
    }
  }

  // 2. invalid_key チェック（空文字列など）
  if (key === '') {
    return {
      code: 'invalid_key',
      message: 'Key must not be empty',
      path: [],
      meta: { key },
    }
  }

  return null
}
