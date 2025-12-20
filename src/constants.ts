/**
 * プロトタイプ汚染防止のため、禁止されたキー名
 * AGENTS.md セキュリティルール参照
 */
export const FORBIDDEN_KEYS = Object.freeze([
  '__proto__',
  'constructor',
  'prototype',
] as const)

export type ForbiddenKey = (typeof FORBIDDEN_KEYS)[number]
