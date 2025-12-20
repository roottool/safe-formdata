export const FORBIDDEN_KEYS = new Set<string>([
  '__proto__',
  'prototype',
  'constructor',
] as const satisfies readonly string[])
