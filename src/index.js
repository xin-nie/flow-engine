import { loadRuleList, print } from './utils'
import createFlowEngine from './flowEngine'

async function main () {
  const path = `${__dirname}/../assets/simple.json`
  const ruleList = await loadRuleList(path)

  const flowEngine = createFlowEngine(ruleList)

  const target1 = { color: 'red' }
  const evaluation1 = flowEngine.evaluate(target1)
  print(evaluation1, target1)

  const target2 = { color: 'blue' }
  const evaluation2 = flowEngine.evaluate(target2)
  print(evaluation2, target2)

  const target3 = {}
  const evaluation3 = flowEngine.evaluate(target3)
  print(evaluation3, target3)

  const target4 = null
  const evaluation4 = flowEngine.evaluate(target4)
  print(evaluation4, target4)
}

main()
