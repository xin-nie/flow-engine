import { getHashTable } from './utils'

export const traverse = (node, target) => {
  if (!node) {
    return []
  }

  let func
  eval(`func = ${node.rule}`); // eslint-disable-line
  const result = func(target)
  const evaluated = [
    {
      id: node.id,
      rule: node.rule,
      title: node.title,
      result
    }
  ]

  if (result) {
    return evaluated.concat(traverse(node.left, target))
  }

  if (!result) {
    return evaluated.concat(traverse(node.right, target))
  }
}

export const getFlowTree = ruleList => {
  const ruleHash = getHashTable(ruleList)
  return ruleList.reduce((tree, rule) => {
    const { id, true_id, false_id } = rule

    if (!tree) {
      tree = ruleHash[id]
    }

    /* eslint-disable camelcase */
    ruleHash[id].left = true_id ? ruleHash[true_id] : null
    ruleHash[id].right = false_id ? ruleHash[false_id] : null
    /* eslint-disable camelcase */

    return tree
  }, null)
}

export const evaluateFlow = flowTree => target => traverse(flowTree, target)

const createFlowEngine = ruleList => {
  const flowTree = getFlowTree(ruleList)
  const evaluate = evaluateFlow(flowTree)

  return {
    ruleList,
    evaluate
  }
}

export default createFlowEngine
