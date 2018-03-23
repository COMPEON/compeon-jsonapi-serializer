import { each, find, get, isPlainObject } from 'lodash'

const getId = (id, lid) => {
  if (id) return { id: String(id) }
  return { lid: String(lid) }
}

export const deserialize = (options = {}) => object => {
  const included = get(object, 'included', {})
  const data = get(object, 'data')

  if (Array.isArray(data)) {
    const results = []

    each(data, resource => {
      const id = get(resource, 'id')
      const result = get(resource, 'attributes', {})
      const relationships = get(resource, 'relationships', {})

      each(relationships, (relationship, relationshipName) => {
        const data = get(relationship, 'data')

        if (Array.isArray(data)) {
          const finalRelationships = []
          each(data, (relationshipDataSet, index) => {
            const { id, lid, type } = relationshipDataSet

            const include = find(included, {
              ...getId(id, lid),
              type
            })

            const dissolvedRelationship = include
              ? { ...getId(id, lid), ...include.attributes }
              : getId(id, lid)

            finalRelationships.push(dissolvedRelationship)
          })

          result[relationshipName] = finalRelationships
        } else if (isPlainObject(data)) {
          const { id, lid, type } = data

          const include = find(included, {
            ...getId(id, lid),
            type
          })

          const dissolvedRelationship = include
            ? { ...getId(id, lid), ...include.attributes }
            : getId(id, lid)

          result[relationshipName] = dissolvedRelationship
        }
      })

      if (id !== undefined) result.id = id

      results.push(result)
    })

    return results
  } else {
    const id = get(data, 'id')
    const result = get(data, 'attributes', {})
    const relationships = get(data, 'relationships', {})

    each(relationships, (relationship, relationshipName) => {
      const data = get(relationship, 'data')

      if (Array.isArray(data)) {
        const finalRelationships = []
        each(data, (relationshipDataSet, index) => {
          const { id, lid, type } = relationshipDataSet

          const include = find(included, {
            ...getId(id, lid),
            type
          })

          const dissolvedRelationship = include
            ? { ...getId(id, lid), ...include.attributes }
            : getId(id, lid)

          finalRelationships.push(dissolvedRelationship)
        })

        result[relationshipName] = finalRelationships
      } else if (isPlainObject(data)) {
        const { id, lid, type } = data

        const include = find(included, {
          ...getId(id, lid),
          type
        })

        const dissolvedRelationship = include
          ? { ...getId(id, lid), ...include.attributes }
          : getId(id, lid)

        result[relationshipName] = dissolvedRelationship
      }
    })

    if (id !== undefined) result.id = id

    return result
  }
}
