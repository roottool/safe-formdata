import { describe, it, expect } from 'vitest'
import { validateKey } from './validate-key.js'

describe('validateKey()', () => {
  describe('forbidden_key検出', () => {
    it('__proto__を拒否する', () => {
      const result = validateKey('__proto__')

      expect(result).not.toBeNull()
      expect(result?.code).toBe('forbidden_key')
      expect(result?.message).toContain('__proto__')
      expect(result?.path).toEqual([])
      expect(result?.meta?.key).toBe('__proto__')
    })

    it('constructorを拒否する', () => {
      const result = validateKey('constructor')

      expect(result).not.toBeNull()
      expect(result?.code).toBe('forbidden_key')
      expect(result?.message).toContain('constructor')
    })

    it('prototypeを拒否する', () => {
      const result = validateKey('prototype')

      expect(result).not.toBeNull()
      expect(result?.code).toBe('forbidden_key')
      expect(result?.message).toContain('prototype')
    })
  })

  describe('invalid_key検出', () => {
    it('空文字列のキーを拒否する', () => {
      const result = validateKey('')

      expect(result).not.toBeNull()
      expect(result?.code).toBe('invalid_key')
      expect(result?.message).toContain('empty')
      expect(result?.path).toEqual([])
      expect(result?.meta?.key).toBe('')
    })
  })

  describe('正常系', () => {
    it('通常のキーは許可する', () => {
      const result = validateKey('username')

      expect(result).toBeNull()
    })

    it('特殊文字を含むキーも許可する', () => {
      const result = validateKey('user[name]')

      expect(result).toBeNull()
    })

    it('数字のキーも許可する', () => {
      const result = validateKey('123')

      expect(result).toBeNull()
    })
  })
})
