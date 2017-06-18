import fs from 'fs'
import promisify from 'util.promisify'
import { isEmpty, normalizer, getRuleList } from '../src/utils'

describe('utils', () => {
  describe('isEmpty', () => {
    test('should return true when object is empty', () => {
      expect(isEmpty({})).toBe(true)
    })

    test('should return false when object is not empty', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })

    test('should return true when array is empty', () => {
      expect(isEmpty([])).toBe(true)
    })

    test('should return false when array is not empty', () => {
      expect(isEmpty([1])).toBe(false)
    })

    test('should throw error when collection undefined', () => {
      function passUndefine () {
        isEmpty()
      }
      expect(passUndefine).toThrow()
    })

    test('should throw error when collection is not array or object', () => {
      function passNumber () {
        isEmpty(1)
      }
      expect(passNumber).toThrow()
    })
  })

  describe('normalizer', () => {
    let readFileAsyc, raw, rules

    beforeEach(async () => {
      readFileAsyc = promisify(fs.readFile)
      raw = await readFileAsyc(`${__dirname}/../assets/simple.json`)
      rules = JSON.parse(raw)
    })

    test('should return a object with key of rule id', () => {
      const expectResult = {
        1: {
          id: '1',
          true_id: '2',
          false_id: '3',
          rule: 'function(obj) { return !!obj; }'
        },
        2: {
          id: '2',
          false_id: '4',
          rule: 'function(obj) { return obj.color === "red"; }'
        },
        3: {
          id: '3',
          rule: 'function(obj) { return obj.color === "blue"; }'
        },
        4: {
          id: '4',
          rule: 'function(obj) { return !!obj.color; }'
        }
      }
      const actualResult = normalizer(rules)
      expect(actualResult).toEqual(expectResult)
    })

    test('should return null when rules are empty', () => {
      expect(normalizer({})).toBe(false)
    })

    test('should throw error if rules are undefined', () => {
      function passUndefine () {
        normalizer()
      }
      expect(passUndefine).toThrow()
    })
  })

  describe('getRuleList', () => {
    it('should return a array of rule object', async () => {
      const path = `${__dirname}/../assets/simple.json`
      const expectResult = [
        {
          id: '1',
          true_id: '2',
          false_id: '3',
          rule: 'function(obj) { return !!obj; }'
        },
        {
          id: '2',
          false_id: '4',
          rule: 'function(obj) { return obj.color === "red"; }'
        },
        {
          id: '3',
          rule: 'function(obj) { return obj.color === "blue"; }'
        },
        {
          id: '4',
          rule: 'function(obj) { return !!obj.color; }'
        }
      ]
      const actualResult = await getRuleList(path)
      expect(actualResult).toEqual(expectResult)
    })

    it('should throw error if wrong path', () => {
      const path = `./s.json`
      getRuleList(path).catch(e => expect(e).toBeDefined())
    })
  })
})
