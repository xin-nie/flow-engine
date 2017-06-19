import fs from 'fs'
import colors from 'colors'
import promisify from 'util.promisify'

export const isEmpty = collection => {
  if (!collection) {
    throw new Error('collection undefined')
  }

  const type = Object.prototype.toString.call(collection).slice(8, -1)

  if (type === 'Array') {
    return collection.length === 0
  }

  if (type === 'Object') {
    return Object.keys(collection).length === 0
  }

  throw new Error('collection must be either array or object')
}

export async function loadRuleList (path) {
  const readFileAsyc = promisify(fs.readFile)

  try {
    const raw = await readFileAsyc(path)
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`get rules failed: ${error}`)
  }
}

// Transfer an array of rules to a hash table indexing by id
export const getHashTable = ruleList =>
  !isEmpty(ruleList) &&
  ruleList.reduce((res, rule) => ({ ...res, [rule.id]: rule }), {})

export const print = (evaluation, target) => {
  if (isEmpty(evaluation)) {
    return null
  }

  console.log(colors.blue(`START - ${JSON.stringify(target)}`))

  evaluation.forEach(
    rule =>
      (rule.result
        ? console.log(colors.green(`Rule "${rule.title}" passed - ${rule.rule}`))
        : console.log(colors.red(`Rule "${rule.title}" failed - ${rule.rule}`)))
  )

  console.log(colors.blue('END.\n'))
}

export default {
  print,
  isEmpty,
  getHashTable,
  loadRuleList
}
