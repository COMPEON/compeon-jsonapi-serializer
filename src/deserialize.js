import {
  find,
  get,
  isPlainObject,
  map,
  reduce
} from 'lodash'

import { extractIdentifier, renderIdentifier } from './common'

const findInclude = (type, identifier, included) => (
  find(included, {
    ...renderIdentifier(identifier),
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
  const identifier = extractIdentifier(resource)
  const { attributes, relationships, type } = resource
  const include = get(findInclude(type, identifier, included), 'attributes')

  return {
    ...renderIdentifier(identifier),
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
