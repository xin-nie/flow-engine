import {
  traverse,
  getFlowTree,
  default as createFlowEngine
} from '../src/flowEngine'

describe('getFlowTree', () => {
  it('should convert list to binary tree', () => {
    const ruleList = [
      {
        id: '1',
        true_id: '2',
        false_id: '3'
      },
      {
        id: '2'
      },
      {
        id: '3'
      }
    ]

    const expectResult = {
      id: '1',
      true_id: '2',
      false_id: '3',
      left: {
        id: '2',
        left: null,
        right: null
      },
      right: {
        id: '3',
        left: null,
        right: null
      }
    }

    const actualResult = getFlowTree(ruleList)
    expect(actualResult).toEqual(expectResult)
  })
})

describe('traverse', () => {
  let ruleList, flowTree

  beforeEach(() => {
    ruleList = [
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

    flowTree = getFlowTree(ruleList)
  })

  it('should return empty array if node is falsy', () => {
    expect(traverse(null)).toEqual([])
  })

  it('should return the rules evaluation by invoking rules on target', () => {
    const target = null
    const expectResult = [
      {
        id: '1',
        rule: 'function(obj) { return !!obj; }',
        title: 'Check object not empty',
        result: false
      },
      {
        id: '5',
        rule: 'function(obj) { return obj === null; }',
        title: 'Check object null',
        result: true
      }
    ]
    const actualResult = traverse(flowTree, target)
    expect(actualResult).toEqual(expectResult)
  })
})

describe('createFlowEngine', () => {
  it('should return an object with ruleList array and evaluate function', () => {
    const result = createFlowEngine([])
    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('ruleList')
    expect(result).toHaveProperty('evaluate')
    expect(result.ruleList).toBeInstanceOf(Array)
    expect(result.evaluate).toBeInstanceOf(Function)
  })
})
