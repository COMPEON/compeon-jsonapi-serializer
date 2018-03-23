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

const deserializeResource = (resource, included, root = false) => {
  const identifier = extractIdentifier(resource)
  const { attributes, relationships, type } = resource
  const {
    attributes: includedAttributes,
    relationships: includedRelationships
  } = findInclude(type, identifier, included) || {}
  const renderedAttributes = root ? attributes : includedAttributes

  return {
    ...renderIdentifier(identifier),
    ...renderedAttributes,
    ...deserializeRelationships(relationships, included),
    ...deserializeRelationships(includedRelationships, included)
  }
}

const deserializeResources = (resources, included, root = false) => (
  map(resources, resource => deserializeResource(resource, included, root))
)

export const deserialize = (options = {}) => subject => {
  const { data, included } = subject

  if (Array.isArray(data)) {
    return deserializeResources(data, included, true)
  } else if (isPlainObject(data)) {
    return deserializeResource(data, included, true)
  }

  return {}
}
