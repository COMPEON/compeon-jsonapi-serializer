import { isPresent } from './utils'

export const extractIdentifier = resource => {
  const name = isPresent(resource.id)
    ? 'id'
    : isPresent(resource.lid)
      ? 'lid'
      : undefined
  const value = isPresent(resource[name])
    ? String(resource[name])
    : undefined

  return {
    name,
    valid: name !== undefined && value !== undefined,
    value
  }
}

export const renderIdentifier = ({ name, value, valid }) => {
  if (!valid) return {}
  return { [name]: value }
}

export const COMPEON_API_JS_TYPE = Symbol('COMPEON_API_JS_TYPE')

export const withPolymorphicType = (type, obj) => {
  if (Array.isArray(obj)) {
    return obj.map(entry => withPolymorphicType(type, entry))
  } else {
    return Object.assign(obj, { [COMPEON_API_JS_TYPE]: type })
  }
}
