import { describe, it, expect } from 'vitest'
import { parse } from '../src/parse'

describe('parse - happy path', () => {
  it('parses flat FormData into an object', () => {
    const fd = new FormData()
    fd.append('name', 'alice')
    fd.append('age', '20')

    const result = parse(fd)

    expect(result.issues).toEqual([])
    expect(result.data).toEqual({
      name: 'alice',
      age: '20',
    })
  })
})

describe('parse - duplicate keys', () => {
  it('reports duplicate_key and returns null data', () => {
    const fd = new FormData()
    fd.append('a', '1')
    fd.append('a', '2')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues).toHaveLength(1)

    const issue = result.issues[0]
    expect(issue.code).toBe('duplicate_key')
    expect(issue.path).toEqual([])
  })
})

describe('parse - no structural inference', () => {
  it('treats bracket notation as opaque keys', () => {
    const fd = new FormData()
    fd.append('items[]', '1')
    fd.append('items[]', '2')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues[0].code).toBe('duplicate_key')
  })
})

describe('parse - forbidden keys', () => {
  it('rejects __proto__', () => {
    const fd = new FormData()
    fd.append('__proto__', 'polluted')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues[0].code).toBe('forbidden_key')
  })

  it('rejects constructor', () => {
    const fd = new FormData()
    fd.append('constructor', 'x')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues[0].code).toBe('forbidden_key')
  })

  it('rejects prototype', () => {
    const fd = new FormData()
    fd.append('prototype', 'malicious')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues).toHaveLength(1)
    expect(result.issues[0].code).toBe('forbidden_key')
    expect(result.issues[0].key).toBe('prototype')
    expect(result.issues[0].path).toEqual([])
  })
})

describe('parse - issue path', () => {
  it('always returns empty path', () => {
    const fd = new FormData()
    fd.append('__proto__', 'x')

    const result = parse(fd)

    expect(result.issues[0].path).toEqual([])
  })
})

describe('parse - data container', () => {
  it('creates data object with no prototype', () => {
    const fd = new FormData()
    fd.append('a', '1')

    const result = parse(fd)

    expect(Object.getPrototypeOf(result.data)).toBeNull()
  })
})

describe('parse - no partial success', () => {
  it('returns null data if any issue exists', () => {
    const fd = new FormData()
    fd.append('ok', '1')
    fd.append('__proto__', 'x')

    const result = parse(fd)

    expect(result.data).toBeNull()
    expect(result.issues.length).toBeGreaterThan(0)
  })
})
