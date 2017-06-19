import fs from 'fs'
import promisify from 'util.promisify'
import { isEmpty, getHashTable, loadRuleList, print } from '../src/utils'

describe('utils', () => {
  describe('isEmpty', () => {
    it('should return true when object is empty', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false when object is not empty', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })

    it('should return true when array is empty', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return false when array is not empty', () => {
      expect(isEmpty([1])).toBe(false)
    })

    it('should throw error when collection undefined', () => {
      function passUndefine () {
        isEmpty()
      }
      expect(passUndefine).toThrow()
    })

    it('should throw error when collection is not array or object', () => {
      function passNumber () {
        isEmpty(1)
      }
      expect(passNumber).toThrow()
    })
  })

  describe('getHashTable', () => {
    let readFileAsyc, raw, rules

    beforeEach(async () => {
      readFileAsyc = promisify(fs.readFile)
      raw = await readFileAsyc(`${__dirname}/../assets/simple.json`)
      rules = JSON.parse(raw)
    })

    it('should return a object with key of rule id', () => {
      const expectResult = {
        1: {
          id: '1',
          true_id: '2',
          false_id: '5',
          rule: 'function(obj) { return !!obj; }',
          title: 'Check object not empty'
        },
        2: {
          id: '2',
          false_id: '3',
          rule: 'function(obj) { return obj.color === "red"; }',
          title: 'Check color red'
        },
        3: {
          id: '3',
          true_id: '4',
          rule: 'function(obj) { return !!obj.color; }',
          title: 'Check color defined'
        },
        4: {
          id: '4',
          rule: 'function(obj) { return obj.color === "blue"; }',
          title: 'Check color blue'
        },
        5: {
          id: '5',
          rule: 'function(obj) { return obj === null; }',
          title: 'Check object null'
        }
      }
      const actualResult = getHashTable(rules)
      expect(actualResult).toEqual(expectResult)
    })

    it('should return null when rules are empty', () => {
      expect(getHashTable({})).toBe(false)
    })

    it('should throw error if rules are undefined', () => {
      function passUndefine () {
        getHashTable()
      }
      expect(passUndefine).toThrow()
    })
  })

  describe('loadRuleList', () => {
    it('should return a array of rule object', async () => {
      const path = `${__dirname}/../assets/simple.json`
      const expectResult = [
        {
          id: '1',
          true_id: '2',
          false_id: '5',
          rule: 'function(obj) { return !!obj; }',
          title: 'Check object not empty'
        },
        {
          id: '2',
          false_id: '3',
          rule: 'function(obj) { return obj.color === "red"; }',
          title: 'Check color red'
        },
        {
          id: '3',
          true_id: '4',
          rule: 'function(obj) { return !!obj.color; }',
          title: 'Check color defined'
        },
        {
          id: '4',
          rule: 'function(obj) { return obj.color === "blue"; }',
          title: 'Check color blue'
        },
        {
          id: '5',
          rule: 'function(obj) { return obj === null; }',
          title: 'Check object null'
        }
      ]
      const actualResult = await loadRuleList(path)
      expect(actualResult).toEqual(expectResult)
    })

    it('should throw error if wrong path', () => {
      const path = `./s.json`
      loadRuleList(path).catch(e => expect(e).toBeDefined())
    })
  })

  describe('print', () => {
    it('should return null if evaluation list is empty', () => {
      expect(print([])).toBe(null)
    })
  })
})
