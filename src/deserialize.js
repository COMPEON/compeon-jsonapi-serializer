import {
  find,
  get,
  isEmpty,
  isPlainObject,
  map,
  reduce
} from 'lodash'

import { extractIdentifier, renderIdentifier } from './common'
import { isPresent } from './utils'

const findInclude = (type, identifier, included) => (
  find(included, {
    ...renderIdentifier(identifier),
    type
  })
)

const renderLinks = (links, key = 'links') => {
  if (!links) return null
  return { [key]: links }
}

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

const deserializeResource = (resource, included, rootLinks, root = false) => {
  const identifier = extractIdentifier(resource)
  const { attributes, links, relationships, type } = resource
  const {
    attributes: includedAttributes,
    links: includedLinks,
    relationships: includedRelationships
  } = findInclude(type, identifier, included) || {}
  const renderedAttributes = root ? attributes : includedAttributes
  const renderedLinks = root ? links : includedLinks

  // Resources without a valid identifier are actually not specified, but
  // otherwise responses that are no resource and thus do not have a valid
  // identifier could not be deserialized.
  if (!root && !identifier.valid) return {}

  return {
    ...renderIdentifier(identifier),
    ...renderedAttributes,
    ...deserializeRelationships(relationships, included),
    ...deserializeRelationships(includedRelationships, included),
    ...renderLinks(rootLinks, 'rootLinks'),
    ...renderLinks(renderedLinks)
  }
}

const deserializeResources = (resources, included, rootLinks, root = false) => (
  map(resources, resource => deserializeResource(resource, included, rootLinks, root))
)

export const deserialize = (options = {}) => subject => {
  const { data, errors, included, links: rootLinks } = subject

  if (isPresent(data) && isPresent(errors)) {
    throw new Error('The keys `data` and `errors` must not coexist in a single document.')
  }

  if (isPresent(data)) {
    if (Array.isArray(data)) {
      return deserializeResources(data, included, rootLinks, true)
    } else if (isPlainObject(data)) {
      return deserializeResource(data, included, rootLinks, true)
    }
  } else if (isPresent(errors)) {
    if (Array.isArray(errors)) return errors
  }

  return {}
}
