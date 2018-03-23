import {
  find,
  get,
  isPlainObject,
  map,
  reduce
} from 'lodash'

import { extractIdentifier } from './utils'

const renderIdentifier = (identifierName, identifierValue) => {
  if (identifierName === undefined) return {}
  return { [identifierName]: identifierValue }
}

const findInclude = (type, identifierName, identifierValue, included) => (
  find(included, {
    [identifierName]: identifierValue,
    type
  })
)

const deserializeRelationships = (relationships, included) => (
  reduce(relationships, (result, value, key) => {
    const data = get(value, 'data')

    if (Array.isArray(data)) {
      result[key] = deserializeResources(data, included)
    } else if (isPlainObject(data)) {
      result[key] = deserializeResource(data, included)
    }

    return result
  }, {})
)

const deserializeResource = (resource, included) => {
  const { identifierName, identifierValue } = extractIdentifier(resource)
  const { attributes, relationships, type } = resource
  const include = get(findInclude(type, identifierName, identifierValue, included), 'attributes')

  return {
    ...renderIdentifier(identifierName, identifierValue),
    ...include,
    ...attributes,
    ...deserializeRelationships(relationships, included)
  }
}

const deserializeResources = (resources, included) => (
  map(resources, resource => deserializeResource(resource, included))
)

export const deserialize = (options = {}) => subject => {
  const { data, included } = subject

  if (Array.isArray(data)) {
    return deserializeResources(data, included)
  } else if (isPlainObject(data)) {
    return deserializeResource(data, included)
  }

  return {}
}
