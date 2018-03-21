import { each, get } from 'lodash'

const getId = (id, lid) => {
  if (id) return { id: String(id) }
  return { lid: String(lid) }
}

export const deserialize = (options = {}) => object => {
  const id = get(object, 'data.id')
  const result = get(object, 'data.attributes', {})
  const relationships = get(object, 'data.relationships', {})

  each(relationships, (relationship, relationshipName) => {
    const data = get(relationship, 'data', {})
    const { id, lid, type } = data

    result[relationshipName] = getId(id, lid)
  })

  if (id !== undefined) result.id = id

  return result
}
