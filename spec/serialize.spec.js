import { serialize } from 'serialize'
import { withPolymorphicType } from 'common'

describe('serialize', () => {
  describe('with simple attributes', () => {
    describe('with valid data', () => {
      const data = {
        id: '123',
        firstName: 'Nico',
        lastName: 'Peters',
        email: 'nico.peters@example.com'
      }

      const serializeUser = serialize('users')

      it('serializes the data', () => {
        expect(serializeUser(data)).toMatchSnapshot()
      })
    })

    describe('with a primitive data type', () => {
      const data = 'string'

      const serializer = serialize('users')

      it('serializes an empty resource', () => {
        expect(serializer(data)).toMatchSnapshot()
      })
    })

    describe('with missing type information', () => {
      it('throws an error', () => {
        expect(() => serialize()).toThrowError()
      })
    })

    describe('with whitelisted attributes', () => {
      const data = {
        id: '123',
        firstName: 'Nico',
        lastName: 'Peters',
        email: 'nico.peters@example.com'
      }

      const serializer = serialize('users', { attributes: ['firstName', 'lastName']})

      it('only serializes specified attributes', () => {
        expect(serializer(data)).toMatchSnapshot()
      })
    })

    describe('with empty attributes list', () => {
      const data = {
        id: '123',
        firstName: 'Nico',
        lastName: 'Peters',
        email: 'nico.peters@example.com'
      }

      const serializer = serialize('users', { attributes: []})

      it('serializes no attributes', () => {
        expect(serializer(data)).toMatchSnapshot()
      })
    })

    describe('with an array of resources and attributes', () => {
      const data = [
        {
          id: '123',
          firstName: 'Nico',
          lastName: 'Peters'
        },
        {
          id: '134',
          firstName: 'Frank',
          lastName: 'Wüller',
          company: {
            id: '66',
            name: 'Compeon'
          }

        }
      ]
      const options = {
        relationships: {
          company: {
            type: 'companies'
          }
        }
      }

      const userSerializer = serialize('user', options)

      it('serializes the data', () => {
        expect(userSerializer(data)).toMatchSnapshot()
      })
    })
  })

  describe('with a 1:1 relationship', () => {
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

    describe('with a polymorphic relationship', () => {
      const data = {
        id: '511',
        firstName: 'Nico',
        lastName: 'Peters',
        organization: withPolymorphicType('companies', {
          id: '666',
          name: 'Compeon GmbH'
        })
      }
      const options = {
        relationships: {
          organization: {
            type: 'polymorphic'
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

    describe('with includes', () => {
      describe('with a normal id', () => {
        const data = {
          id: '1234',
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            id: '612',
            name: 'Compeon GmbH'
          }
        }
        const options = {
          relationships: {
            company: {
              type: 'companies'
            }
          }
        }

        const userSerializer = serialize('users', options)

        it('serializes the data', () => {
          expect(userSerializer(data)).toMatchSnapshot()
        })
      })

      describe('with a local id', () => {
        const data = {
          id: '1234',
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            lid: '612',
            name: 'Compeon GmbH'
          }
        }
        const options = {
          relationships: {
            company: {
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

  describe('with a 1:n relationship', () => {
    describe('with a normal id', () => {
      const data = {
        id: '511',
        firstName: 'Nico',
        lastName: 'Peters',
        companies: [
          {
            id: '666',
            name: 'Compeon GmbH'
          },
          {
            id: '667',
            name: 'Compeon 4.0 GmbH'
          }
        ]
      }
      const options = {
        relationships: {
          companies: {
            type: 'companies'
          }
        }
      }

      const serializeUser = serialize('users', options)

      it('serializes the data', () => {
        expect(serializeUser(data)).toMatchSnapshot()
      })
    })

    describe('with a polymorphic relationship', () => {
      const data = {
        id: '511',
        firstName: 'Nico',
        lastName: 'Peters',
        organizations: [
          withPolymorphicType('companies', {
            id: '666',
            name: 'Compeon GmbH'
          }),
          withPolymorphicType('multiplier-organizations', {
            id: '667',
            name: 'Compeon 4.0 GmbH'
          })
        ],
        colleagues: withPolymorphicType('users', [
          { id: '777', name: 'Arno Admin' },
          { id: '333', name: 'Ben Utzer' }
        ])
      }
      const options = {
        relationships: {
          organizations: {
            type: 'polymorphic'
          },
          colleagues: {
            type: 'polymorphic'
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
        companies: [
          {
            lid: '666',
            name: 'Compeon GmbH'
          },
          {
            id: '667',
            name: 'Compeon 4.0 GmbH'
          }
        ]
      }
      const options = {
        relationships: {
          companies: {
            type: 'companies'
          }
        }
      }

      const serializeUser = serialize('users', options)

      it('serializes the data', () => {
        expect(serializeUser(data)).toMatchSnapshot()
      })
    })

    describe('when no relationship identifier is found™', () => {
      const data = {
        id: '123',
        companies: [
          {
            id: '666',
            name: 'Compeon GmbH'
          },
          {
            name: 'Compeon 4.0 GmbH'
          }
        ]
      }
      const options = {
        relationships: {
          companies: {
            type: 'companies'
          }
        }
      }

      const userSerializer = serialize('users', options)

      it('ignores the faulty relationship and serializes the valid one', () => {
        expect(userSerializer(data)).toMatchSnapshot()
      })
    })

    describe('with includes', () => {
      describe('with a normal id', () => {
        const data = {
          id: '511',
          firstName: 'Nico',
          lastName: 'Peters',
          companies: [
            {
              id: '666',
              name: 'Compeon GmbH'
            },
            {
              id: '667',
              name: 'Compeon 4.0 GmbH'
            }
          ]
        }
        const options = {
          relationships: {
            companies: {
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
          companies: [
            {
              lid: '666',
              name: 'Compeon GmbH'
            },
            {
              id: '667',
              name: 'Compeon 4.0 GmbH'
            }
          ]
        }
        const options = {
          relationships: {
            companies: {
              type: 'companies'
            }
          }
        }

        const serializeUser = serialize('users', options)

        it('serializes the data', () => {
          expect(serializeUser(data)).toMatchSnapshot()
        })
      })

      describe('with deeply nested relationships', () => {
        const data = {
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            id: '12',
            name: 'Compeon GmbH',
            tags: [
              {
                id: '66',
                name: 'Tag 1',
                version: {
                  id: '95123',
                  date: '19.03.2017'
                }
              },
              {
                lid: '777',
                name: 'New sideposted tag'
              }
            ]
          }
        }
        const options = {
          relationships: {
            company: {
              type: 'companies',
              relationships: {
                tags: {
                  type: 'tags',
                  attributes: ['name'],
                  relationships: {
                    version: {
                      type: 'versions'
                    }
                  }
                }
              }
            }
          }
        }

        const userSerializer = serialize('users', options)

        it('serializes the data', () => {
          expect(userSerializer(data)).toMatchSnapshot()
        })
      })

      describe('with duplicate includes', () => {
        const data = {
          id: '511',
          firstName: 'Nico',
          lastName: 'Peters',
          company: {
            id: '666',
            name: 'Compeon GmbH'
          },
          employees: [
            {
              id: '152',
              firstName: 'Arno',
              lastName: 'Apitester',
              company: {
                id: '666',
                name: 'Compeon GmbH'
              }
            }
          ]
        }
        const options = {
          relationships: {
            company: {
              type: 'companies'
            },
            employees: {
              type: 'users',
              relationships: {
                company: {
                  type: 'companies'
                }
              }
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

  describe('with invalid options', () => {
    describe('when no relationship type is set', () => {
      const data = {
        id: '123',
        company: {
          id: '612'
        }
      }
      const options = {
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

    describe('when no relationship type is set for a polymorphic relationship', () => {
      const data = {
        id: '123',
        organization: {
          id: '612'
        }
      }
      const options = {
        relationships: {
          organization: {
            type: 'polymorphic'
          }
        }
      }

      const userSerializer = serialize('users', options)

      it('throws an error', () => {
        expect(() => userSerializer(data)).toThrowError()
      })
    })
  })
})
