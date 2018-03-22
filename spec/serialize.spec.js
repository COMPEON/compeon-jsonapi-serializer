import { serialize } from 'serialize'

describe('serialize', () => {
  describe('with simple attributes', () => {
    describe('with valid data', () => {
      const data = {
        id: '123',
        firstName: 'Nico',
        lastName: 'Peters',
        email: 'nico.peters@example.com'
      }
      const options = {
        attributes: ['firstName', 'lastName']
      }

      const serializeUser = serialize('users', options)

      it('serializes the data', () => {
        expect(serializeUser(data)).toMatchSnapshot()
      })
    })

    describe('with empty attributes', () => {
      const data = {
        id: '125',
        firstName: 'Nico'
      }

      const serializeUser = serialize('users')

      it('serializes no attributes key', () => {
        expect(serializeUser(data)).toMatchSnapshot()
      })
    })

    describe('with missing type information', () => {
      it('throws an error', () => {
        expect(() => serialize()).toThrowError()
      })
    })
  })

  describe('with relationships', () => {
    describe('with valid data', () => {
      describe('with a normal id', () => {
        const data = {
          id: '511',
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            id: '666',
            name: 'Compeon GmbH'
          }
        }
        const options = {
          attributes: ['company', 'firstName', 'lastName'],
          relationships: {
            company: {
              type: 'companies'
            }
          }
        }

        const serializeUser = serialize('users', options)

        it('serializes the data', () => {
          expect(serializeUser(data)).toMatchSnapshot()
        })
      })

      describe('with a local id', () => {
        const data = {
          id: '511',
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            lid: '666',
            name: 'Compeon GmbH'
          }
        }
        const options = {
          attributes: ['company', 'firstName', 'lastName'],
          relationships: {
            company: {
              type: 'companies'
            }
          }
        }

        const serializeUser = serialize('users', options)

        it('serializes the data', () => {
          expect(serializeUser(data)).toMatchSnapshot()
        })
      })
    })

    describe('with invalid options', () => {
      describe('when no relationship type is set', () => {
        const data = {
          id: '123',
          company: {
            id: '612'
          }
        }
        const options = {
          attributes: ['company'],
          relationships: {
            company: {
            }
          }
        }

        const userSerializer = serialize('users', options)

        it('throws an error', () => {
          expect(() => userSerializer(data)).toThrowError()
        })
      })
    })

    describe('with includes', () => {
      const data = {
        id: '1234',
        firstName: 'Nico',
        lastName: 'Peters',
        company: {
          id: '612',
          name: 'Compeong GmbH'
        }
      }
      const options = {
        attributes: ['firstName', 'lastName', 'company'],
        relationships: {
          company: {
            attributes: ['name'],
            type: 'companies'
          }
        }
      }

      const userSerializer = serialize('users', options)

      it('serializes the data', () => {
        expect(userSerializer(data)).toMatchSnapshot()
      })
    })
  })
})
