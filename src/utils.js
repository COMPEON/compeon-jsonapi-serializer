export const isPresent = value => (
  value !== undefined && value !== null && value !== ''
)

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
