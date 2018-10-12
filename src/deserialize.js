import {
  find,
  get,
  isEmpty,
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
    const links = get(value, 'links')
    let deserializedResource

    if (Array.isArray(data)) {
      deserializedResource = deserializeResources(data, included, links)
    } else if (isPlainObject(data)) {
      deserializedResource = deserializeResource(data, included, links)
    }

    if (!isEmpty(deserializedResource)) result[key] = deserializedResource

    return result
  }, {})
)

const deserializeResource = (resource, included, links, root = false) => {
  const identifier = extractIdentifier(resource)
  const { attributes, relationships, type } = resource
  const {
    attributes: includedAttributes,
    relationships: includedRelationships
  } = findInclude(type, identifier, included) || {}
  const renderedAttributes = root ? attributes : includedAttributes

  // Resources without a valid identifier are actually not specified, but
  // otherwise responses that are no resource and thus do not have a valid
  // identifier could not be deserialized.
  if (!root && !identifier.valid) return {}

  const deserializedResource = {
    ...renderIdentifier(identifier),
    ...renderedAttributes,
    ...deserializeRelationships(relationships, included),
    ...deserializeRelationships(includedRelationships, included)
  }

  if (links) deserializedResource.links = links

  return deserializedResource
}

const deserializeResources = (resources, included, links, root = false) => (
  map(resources, resource => deserializeResource(resource, included, links, root))
)

export const deserialize = (options = {}) => subject => {
  const { data, included, links } = subject

  if (Array.isArray(data)) {
    return deserializeResources(data, included, links, true)
  } else if (isPlainObject(data)) {
    return deserializeResource(data, included, links, true)
  }

  return {}
}
