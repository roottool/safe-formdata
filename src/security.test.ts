import { describe, it, expect } from 'vitest'
import { parse } from './parse.js'

describe('セキュリティ境界', () => {
  describe('プロトタイプ汚染防止', () => {
    it('dataはプロトタイプを持たない', () => {
      const formData = new FormData()
      formData.append('safe', 'value')

      const result = parse(formData)

      expect(Object.getPrototypeOf(result.data)).toBeNull()
    })

    it('禁止キーを含むFormDataはdataをnullにする', () => {
      const formData = new FormData()
      formData.append('__proto__', '{"polluted": true}')

      const result = parse(formData)

      expect(result.data).toBeNull()
    })

    it('constructorキーを含むFormDataはdataをnullにする', () => {
      const formData = new FormData()
      formData.append('constructor', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
    })

    it('prototypeキーを含むFormDataはdataをnullにする', () => {
      const formData = new FormData()
      formData.append('prototype', 'malicious')

      const result = parse(formData)

      expect(result.data).toBeNull()
    })

    it('通常のdataオブジェクトにはtoStringやvalueOfが継承されない', () => {
      const formData = new FormData()
      formData.append('key', 'value')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      // Object.create(null)で作成されたオブジェクトはプロトタイプメソッドを持たない
      expect('toString' in result.data!).toBe(false)
      expect('valueOf' in result.data!).toBe(false)
    })
  })

  describe('構造推論の拒否（AGENTS.md Design Rule 1）', () => {
    it('user[name]を構造化せず、そのまま扱う', () => {
      const formData = new FormData()
      formData.append('user[name]', 'alice')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['user[name]']).toBe('alice')
      // ネストしたオブジェクトにはならない
      expect(result.data!['user']).toBeUndefined()
    })

    it('items[]を配列化せず、そのまま扱う', () => {
      const formData = new FormData()
      formData.append('items[]', 'apple')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['items[]']).toBe('apple')
      // 配列にはならない
      expect(result.data!['items']).toBeUndefined()
      expect(Array.isArray(result.data!['items[]'])).toBe(false)
    })

    it('user.email を構造化せず、そのまま扱う', () => {
      const formData = new FormData()
      formData.append('user.email', 'alice@example.com')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['user.email']).toBe('alice@example.com')
      // ドット記法の構造化は行わない
      expect(result.data!['user']).toBeUndefined()
    })

    it('複雑な構造を示唆するキーもフラットに扱う', () => {
      const formData = new FormData()
      formData.append('data[items][0][name]', 'item1')
      formData.append('data[items][1][name]', 'item2')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.data!['data[items][0][name]']).toBe('item1')
      expect(result.data!['data[items][1][name]']).toBe('item2')
      // ネスト構造には変換されない
      expect(result.data!['data']).toBeUndefined()
    })
  })

  describe('サイレント動作の拒否（AGENTS.md Design Rule 2）', () => {
    it('重複キーは最後の値を取らず、issueとして報告する', () => {
      const formData = new FormData()
      formData.append('name', 'first')
      formData.append('name', 'second')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.code).toBe('duplicate_key')
    })

    it('空のキーは許可せず、issueとして報告する', () => {
      const formData = new FormData()
      formData.append('', 'value')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.code).toBe('invalid_key')
    })
  })

  describe('明示的なissue報告（AGENTS.md Design Rule 4）', () => {
    it('部分的な成功は許可せず、すべてのissueを報告する', () => {
      const formData = new FormData()
      formData.append('valid1', 'ok')
      formData.append('__proto__', 'bad')
      formData.append('valid2', 'ok')
      formData.append('', 'empty key')

      const result = parse(formData)

      expect(result.data).toBeNull()
      expect(result.issues).toHaveLength(2)
    })

    it('issueがない場合のみdataを返す', () => {
      const formData = new FormData()
      formData.append('username', 'alice')
      formData.append('email', 'alice@example.com')

      const result = parse(formData)

      expect(result.data).not.toBeNull()
      expect(result.issues).toHaveLength(0)
    })
  })
})
