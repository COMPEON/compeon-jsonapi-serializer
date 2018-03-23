import {
  includes,
  isEmpty,
  isPlainObject,
  pick
} from 'lodash'

import {
  extractIdentifier,
  partition,
  renderIdentifier
} from './utils'

const extractResourceInformation = (resource, attributeNames, relationshipNames) => {
  const identifier = extractIdentifier(resource)
  const permittedAttributes = pick(resource, attributeNames)
  const [relationships, attributes] = partition(permittedAttributes, (_, key) => (
    includes(relationshipNames, key)
  ))

  return {
    attributes,
    identifier,
    relationships
  }
}

const renderResourceAttribute = (key, attribute) => {
  if (isEmpty(attribute)) return null
  return { [key]: attribute }
}

const renderResource = (type, identifier = {}, attributes, relationships) => ({
  data: {
    ...renderIdentifier(identifier),
    ...renderResourceAttribute('attributes', attributes),
    ...renderResourceAttribute('relationships', relationships),
    type
  }
})

const serializeRootResource = (type, resource, options) => {
  const attributeOptions = options.attributes || []
  const relationshipOptions = options.relationships || {}
  const relationshipNames = Object.keys(relationshipOptions)
  const {
    attributes,
    identifier,
    relationships
  } = extractResourceInformation(resource, attributeOptions, relationshipNames)
  return renderResource(type, identifier, attributes, relationships)
}

export const serialize = (type, options = {}) => {
  if (!type) throw 'You did not specify a type for the root resource.'

  return subject => {
    if (Array.isArray(subject)) {
      return serializeRootResources(type, subject, options)
    } else if (isPlainObject(subject)) {
      return serializeRootResource(type, subject, options)
    }

    return renderResource(type)
  //   const { id, ...attributes } = object
  //   const whitelistedAttributes = pick(attributes, options.attributes)
  //   const result = {
  //     data: {
  //       id,
  //       type
  //     }
  //   }

  //   const included = []
  //   const relationships = {}

  //   each(options.relationships, (relationship, relationshipName) => {
  //     const relationshipData = whitelistedAttributes[relationshipName]

  //     if (Array.isArray(relationshipData)) {
  //       const finalRelationships = []

  //       each(relationshipData, (relationshipDataSet, index) => {
  //         const id = get(relationshipDataSet, `id`)
  //         const lid = get(relationshipDataSet, `lid`)
  //         const relationshipAttributes = pick(relationshipDataSet, relationship.attributes)

  //         if (id === undefined && lid === undefined) return
  //         if (!relationship.type) throw `You did not specify a type for the ${relationshipName} resource.`

  //         const finalRelationship = {
  //           ...getId(id, lid),
  //           type: relationship.type
  //         }

  //         if (!isEmpty(relationshipAttributes)) {
  //           included.push({
  //             ...getId(id, lid),
  //             type: relationship.type,
  //             attributes: relationshipAttributes
  //           })
  //         }

  //         finalRelationships.push(finalRelationship)
  //       })

  //       if (!isEmpty(finalRelationships)) {
  //         relationships[relationshipName] = {
  //           data: finalRelationships
  //         }
  //       }
  //     } else {
  //       const id = get(whitelistedAttributes, `${relationshipName}.id`)
  //       const lid = get(whitelistedAttributes, `${relationshipName}.lid`)
  //       const relationshipAttributes = pick(whitelistedAttributes[relationshipName], relationship.attributes)

  //       if (id === undefined && lid === undefined) return
  //       if (!relationship.type) throw `You did not specify a type for the ${relationshipName} resource.`

  //       const finalRelationship = {
  //         data: {
  //           ...getId(id, lid),
  //           type: relationship.type
  //         }
  //       }

  //       if (!isEmpty(relationshipAttributes)) {
  //         included.push({
  //           ...getId(id, lid),
  //           type: relationship.type,
  //           attributes: relationshipAttributes
  //         })
  //       }

  //       relationships[relationshipName] = finalRelationship
  //     }

  //     delete whitelistedAttributes[relationshipName]
  //   })

  //   if (!isEmpty(whitelistedAttributes)) result.data.attributes = whitelistedAttributes
  //   if (!isEmpty(relationships)) result.data.relationships = relationships
  //   if (!isEmpty(included)) result.included = included

  //   return result
  }
}
