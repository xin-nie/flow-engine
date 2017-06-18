import fs from 'fs'
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

export async function getRuleList (path) {
  const readFileAsyc = promisify(fs.readFile)

  try {
    const raw = await readFileAsyc(path)
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`get rules failed: ${error}`)
  }
}

/**
 * Transfer an array of rules to a hash table indexing by id
 * in order to have O(1) search for each rule object
 */
export const normalizer = rules =>
  !isEmpty(rules) &&
  rules.reduce((res, rule) => ({ ...res, [rule.id]: rule }), {})

export default {
  isEmpty,
  normalizer,
  getRuleList
}
