import { reduce } from 'lodash'

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
