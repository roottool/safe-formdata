import { describe, it, expect } from 'vitest'
import { FORBIDDEN_KEYS } from './forbiddenKeys'

describe('FORBIDDEN_KEYS', () => {
  it('contains prototype pollution primitives', () => {
    expect(FORBIDDEN_KEYS.has('__proto__')).toBe(true)
    expect(FORBIDDEN_KEYS.has('prototype')).toBe(true)
    expect(FORBIDDEN_KEYS.has('constructor')).toBe(true)
  })

  it('does not block common object keys', () => {
    expect(FORBIDDEN_KEYS.has('toString')).toBe(false)
    expect(FORBIDDEN_KEYS.has('hasOwnProperty')).toBe(false)
    expect(FORBIDDEN_KEYS.has('valueOf')).toBe(false)
  })

  it('does not treat bracket notation as forbidden', () => {
    expect(FORBIDDEN_KEYS.has('a[b]')).toBe(false)
    expect(FORBIDDEN_KEYS.has('items[]')).toBe(false)
  })

  it('is a Set of strings', () => {
    expect(FORBIDDEN_KEYS).toBeInstanceOf(Set)
    for (const key of FORBIDDEN_KEYS) {
      expect(typeof key).toBe('string')
    }
  })
})
