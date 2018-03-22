import { deserialize } from 'deserialize'

describe('deserialize', () => {
  describe('with simple attributes', () => {
    describe('with valid attributes', () => {
      const json = {
        data: {
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          id: '123',
          type: 'users'
        }
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })

    describe('with invalid attributes', () => {
      const json = {
        data: {}
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })
  })

  describe('with relationships', () => {
    describe('with valid relationships', () => {
      describe('with a normal id', () => {
        const json = {
          data: {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            relationships: {
              company: {
                data: {
                  id: '666',
                  type: 'companies'
                }
              }
            },
            id: '123',
            type: 'users'
          }
        }

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('with a local id', () => {
        const json = {
          data: {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            relationships: {
              company: {
                data: {
                  lid: '666',
                  type: 'companies'
                }
              }
            },
            id: '123',
            type: 'users'
          }
        }

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })
    })

    describe('with includes', () => {
      describe('with a normal id', () => {
        const json = {
          data: {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            relationships: {
              company: {
                data: {
                  id: '666',
                  type: 'companies'
                }
              }
            },
            id: '123',
            type: 'users'
          },
          included: [{
            id: '666',
            type: 'companies',
            attributes: {
              name: 'Compeong GmbH',
              city: 'Düsseldorf'
            }
          }]
        }

        it.only('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('with a local id', () => {
        const json = {
          data: {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            relationships: {
              company: {
                data: {
                  lid: '666',
                  type: 'companies'
                }
              }
            },
            id: '123',
            type: 'users'
          },
          included: [{
            lid: '666',
            type: 'companies',
            attributes: {
              name: 'Compeong GmbH',
              city: 'Düsseldorf'
            }
          }]
        }

        it.only('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })
    })
  })
})
