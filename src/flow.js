import colors from 'colors'
import { normalizer } from './utils'

export const evaluate = rules => ruleId => target => {
  if (!ruleId) {
    console.log(colors.blue('End'))
    return false
  }

  const { id, rule, true_id, false_id } = rules[ruleId]

  let func
  eval(`func = ${rule}`); // eslint-disable-line

  const res = func(target)
  if (res) {
    console.log(colors.green(`Rule ${id} passed`))
    evaluate(rules)(true_id)(target)
  } else {
    console.log(colors.red(`Rule ${id} falied`))
    evaluate(rules)(false_id)(target)
  }
}

const createFlow = ruleList => {
  const rootId = ruleList[0].id
  const rules = normalizer(ruleList)
  const evaluator = target => {
    console.log(colors.blue('Start'))
    evaluate(rules)(rootId)(target)
  }

  return {
    rootId,
    rules,
    evaluator
  }
}

export default createFlow
