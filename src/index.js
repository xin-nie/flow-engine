import { getRuleList } from './utils'
import createFlow from './flow'

async function main () {
  const path = `${__dirname}/../assets/simple.json`
  const ruleList = await getRuleList(path)

  const flow = createFlow(ruleList)

  flow.evaluator({ color: 'red' })
}

main()
