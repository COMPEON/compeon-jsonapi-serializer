import { get } from 'lodash'

export const deserialize = (options = {}) => object => {
  const id = get(object, 'data.id')
  const result = get(object, 'data.attributes', {})

  if (id !== undefined) result.id = id

  return result
}
