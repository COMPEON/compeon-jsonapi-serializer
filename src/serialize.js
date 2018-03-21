export const serialize = (type, options = {}) => {
  if (!type) throw 'You did not specify a type for the root resource.'

  return object => {
    const { id, ...attributes } = object

    return {
      data: {
        attributes,
        id,
        type
      }
    }
  }
}
