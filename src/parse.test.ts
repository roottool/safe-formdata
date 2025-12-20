import { describe, it, expect } from 'vitest'
import { parse } from './parse.js'

describe('parse()', () => {
  describe('正常系', () => {
    it('空のFormDataをパースできる', () => {
      const formData = new FormData()
      const result = parse(formData)

      expect(result.data).toEqual(Object.create(null))
      expect(result.issues).toEqual([])
    })

    it('単一のキー・バリューをパースできる', () => {
      const formData = new FormData()
      formData.append('username', 'alice')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['username']).toBe('alice')
      expect(result.issues).toEqual([])
    })

    it('Fileオブジェクトをパースできる', () => {
      const formData = new FormData()
      const file = new File(['content'], 'test.txt')
      formData.append('upload', file)

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['upload']).toBe(file)
      expect(result.issues).toEqual([])
    })

    it('複数のキー・バリューをパースできる', () => {
      const formData = new FormData()
      formData.append('username', 'alice')
      formData.append('email', 'alice@example.com')
      formData.append('age', '30')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['username']).toBe('alice')
      expect(result.data!['email']).toBe('alice@example.com')
      expect(result.data!['age']).toBe('30')
      expect(result.issues).toEqual([])
    })
  })

  describe('forbidden_key検出', () => {
    it('__proto__を拒否する', () => {
      const formData = new FormData()
      formData.append('__proto__', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.code).toBe('forbidden_key')
    })

    it('constructorを拒否する', () => {
      const formData = new FormData()
      formData.append('constructor', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues[0]?.code).toBe('forbidden_key')
    })

    it('prototypeを拒否する', () => {
      const formData = new FormData()
      formData.append('prototype', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues[0]?.code).toBe('forbidden_key')
    })
  })

  describe('duplicate_key検出', () => {
    it('重複キーを検出する', () => {
      const formData = new FormData()
      formData.append('item', 'first')
      formData.append('item', 'second')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.code).toBe('duplicate_key')
      expect(result.issues[0]?.meta?.key).toBe('item')
    })

    it('3つ以上の重複キーを検出する', () => {
      const formData = new FormData()
      formData.append('item', 'first')
      formData.append('item', 'second')
      formData.append('item', 'third')

      const result = parse(formData)

      expect(result.data).toBeNull()
      // 2番目と3番目で2つのissue
      expect(result.issues).toHaveLength(2)
      expect(result.issues.every((i) => i.code === 'duplicate_key')).toBe(true)
    })
  })

  describe('invalid_key検出', () => {
    it('空文字列のキーを拒否する', () => {
      const formData = new FormData()
      formData.append('', 'value')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues[0]?.code).toBe('invalid_key')
    })
  })

  describe('部分成功の禁止', () => {
    it('issuesがある場合、dataはnullになる', () => {
      const formData = new FormData()
      formData.append('valid', 'ok')
      formData.append('__proto__', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it('複数のissuesがある場合もdataはnull', () => {
      const formData = new FormData()
      formData.append('', 'empty key')
      formData.append('__proto__', 'malicious')
      formData.append('item', 'first')
      formData.append('item', 'duplicate')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues.length).toBeGreaterThan(2)
    })
  })

  describe('issueの構造', () => {
    it('issueは正しい構造を持つ', () => {
      const formData = new FormData()
      formData.append('__proto__', 'test')

      const result = parse(formData)

      const issue = result.issues[0]
      expect(issue).toBeDefined()
      expect(issue?.code).toBe('forbidden_key')
      expect(issue?.message).toBeTypeOf('string')
      expect(issue?.path).toEqual([])
      expect(issue?.meta).toBeDefined()
    })
  })
})
