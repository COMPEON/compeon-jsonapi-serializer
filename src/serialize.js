import { each, get, isEmpty, pick } from 'lodash'

const getId = (id, lid) => {
  if (id) return { id: String(id) }
  return { lid: String(lid) }
}

export const serialize = (type, options = {}) => {
  if (!type) throw 'You did not specify a type for the root resource.'

  return object => {
    const { id, ...attributes } = object
    const whitelistedAttributes = pick(attributes, options.attributes)
    const result = {
      data: {
        id,
        type
      }
    }

    const included = []
    const relationships = {}

    each(options.relationships, (relationship, relationshipName) => {
      const relationshipData = whitelistedAttributes[relationshipName]

      if (Array.isArray(relationshipData)) {
        const finalRelationships = []

        each(relationshipData, (relationshipDataSet, index) => {
          const id = get(relationshipDataSet, `id`)
          const lid = get(relationshipDataSet, `lid`)
          const relationshipAttributes = pick(relationshipDataSet, relationship.attributes)

          if (id === undefined && lid === undefined) return
          if (!relationship.type) throw `You did not specify a type for the ${relationshipName} resource.`

          const finalRelationship = {
            ...getId(id, lid),
            type: relationship.type
          }

          if (!isEmpty(relationshipAttributes)) {
            included.push({
              ...getId(id, lid),
              type: relationship.type,
              attributes: relationshipAttributes
            })
          }

          finalRelationships.push(finalRelationship)
        })

        if (!isEmpty(finalRelationships)) {
          relationships[relationshipName] = {
            data: finalRelationships
          }
        }
      } else {
        const id = get(whitelistedAttributes, `${relationshipName}.id`)
        const lid = get(whitelistedAttributes, `${relationshipName}.lid`)
        const relationshipAttributes = pick(whitelistedAttributes[relationshipName], relationship.attributes)

        if (id === undefined && lid === undefined) return
        if (!relationship.type) throw `You did not specify a type for the ${relationshipName} resource.`

        const finalRelationship = {
          data: {
            ...getId(id, lid),
            type: relationship.type
          }
        }

        if (!isEmpty(relationshipAttributes)) {
          included.push({
            ...getId(id, lid),
            type: relationship.type,
            attributes: relationshipAttributes
          })
        }

        relationships[relationshipName] = finalRelationship
      }

      delete whitelistedAttributes[relationshipName]
    })

    if (!isEmpty(whitelistedAttributes)) result.data.attributes = whitelistedAttributes
    if (!isEmpty(relationships)) result.data.relationships = relationships
    if (!isEmpty(included)) result.included = included

    return result
  }
}
