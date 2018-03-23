export const isPresent = value => (
  value !== undefined && value !== null && value !== ''
)

export const extractIdentifier = resource => {
  const identifierName = isPresent(resource.id)
    ? 'id'
    : isPresent(resource.lid)
      ? 'lid'
      : undefined
  const identifierValue = isPresent(resource[identifierName])
    ? String(resource[identifierName])
    : undefined

  return { identifierName, identifierValue }
}
