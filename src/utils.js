import { reduce } from 'lodash'

export const mergeArrays = (firstArray, secondArray) => {
  if (!Array.isArray(firstArray)) {
    if (!Array.isArray(secondArray)) return []
    return [...secondArray]
  }
  return [...firstArray, ...secondArray]
}

export const isPresent = value => (
  value !== undefined && value !== null && value !== ''
)

export const partition = (object, func) => (
  reduce(object, (partitions, value, key) => {
    const partitionIndex = func(value, key) ? 0 : 1
    partitions[partitionIndex][key] = value
    return partitions
  }, [{}, {}])
)
