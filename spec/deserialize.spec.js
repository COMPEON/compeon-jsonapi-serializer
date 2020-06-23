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

    describe('with JSONAPI errors', () => {
      describe('with an error array', () => {
        const json = {
          errors: [{
            id: '123',
            links: {
              about: 'htpp://ulf.de'
            },
            title: 'Title'
          }]
        }

        it('returns the errors', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('with a non-array error', () => {
        const json = {
          errors: {
            id: '123',
            links: {
              about: 'htpp://ulf.de'
            },
            title: 'Title'
          }
        }

        it('returns an empty object', () => {
          expect(deserialize()(json)).toEqual({})
        })
      })
    })

    describe('with invalid attributes', () => {
      describe('when data is empty', () => {
        const json = {
          data: {}
        }

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('when data does not exist', () => {
        const json = {}

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('when data and errors both exist', () => {
        const json = {
          data: {},
          errors: {}
        }

        it('throws an error', () => {
          expect(() => deserialize()(json)).toThrowError(
            'The keys `data` and `errors` must not coexist in a single document.'
          )
        })
      })
    })
  })

  describe('with an array of resources', () => {
    describe('with valid attributes', () => {
      const json = {
        data: [
          {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            id: '123',
            type: 'users'
          },
          {
            attributes: {
              firstName: 'Frank',
              lastName: 'Wüller'
            },
            id: '234',
            type: 'users'
          }
        ]
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })
  })

  describe('with a 1:1 relationship', () => {
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
              name: 'Compeon GmbH',
              city: 'Düsseldorf'
            }
          }]
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
          },
          included: [{
            lid: '666',
            type: 'companies',
            attributes: {
              name: 'Compeon GmbH',
              city: 'Düsseldorf'
            }
          }]
        }

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })
    })
  })

  describe('with a 1:n relationship', () => {
    describe('with a normal id', () => {
      const json = {
        data: {
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          relationships: {
            companies: {
              data: [
                {
                  id: '666',
                  type: 'companies'
                },
                {
                  id: '667',
                  type: 'companies'
                }
              ]
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
            companies: {
              data: [
                {
                  lid: '666',
                  type: 'companies'
                },
                {
                  id: '667',
                  type: 'companies'
                }
              ]
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

    describe('with includes', () => {
      describe('with a normal id', () => {
        const json = {
          data: {
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            relationships: {
              companies: {
                data: [
                  {
                    id: '666',
                    type: 'companies'
                  },
                  {
                    id: '667',
                    type: 'companies'
                  }
                ]
              }
            },
            id: '123',
            type: 'users'
          },
          included: [
            {
              id: '666',
              type: 'companies',
              attributes: {
                name: 'Compeon GmbH',
                city: 'Düsseldorf'
              }
            },
            {
              id: '667',
              type: 'companies',
              attributes: {
                name: 'Compeon 4.0 GmbH',
                city: 'Düsseldorf'
              }
            }
          ]
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
              companies: {
                data: [
                  {
                    lid: '666',
                    type: 'companies'
                  },
                  {
                    id: '667',
                    type: 'companies'
                  }
                ]
              }
            },
            id: '123',
            type: 'users'
          },
          included: [
            {
              lid: '666',
              type: 'companies',
              attributes: {
                name: 'Compeon GmbH',
                city: 'Düsseldorf'
              }
            },
            {
              id: '667',
              type: 'companies',
              attributes: {
                name: 'Compeon 4.0 GmbH',
                city: 'Düsseldorf'
              }
            }
          ]
        }

        it('deserializes the json', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })
    })

    describe('with relationships with links', () => {
      const json = {
        data: {
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          relationships: {
            companies: {
              data: [
                {
                  id: '666',
                  type: 'companies'
                },
                {
                  id: '667',
                  type: 'companies'
                }
              ]
            }
          },
          id: '123',
          type: 'users'
        },
        included: [
          {
            id: '666',
            type: 'companies',
            attributes: {
              name: 'Compeon GmbH',
              city: 'Düsseldorf'
            },
            links: {
              self: 'htpp://ulf.de/companies/666'
            }
          },
          {
            id: '667',
            type: 'companies',
            attributes: {
              name: 'Compeon 4.0 GmbH',
              city: 'Düsseldorf'
            }
          }
        ]
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })

    describe('with relationships inside an array of resources', () => {
      const json = {
        data: [
          {
            id: '123',
            type: 'users',
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
            }
          },
          {
            id: '234',
            type: 'users',
            attributes: {
              firstName: 'Frank',
              lastName: 'Wüller'
            },
            relationships: {
              company: {
                data: {
                  lid: '666',
                  type: 'companies'
                }
              },
              tags: {
                data: [
                  {
                    id: '912',
                    type: 'tags'
                  },
                  {
                    id: '56',
                    type: 'tags'
                  }
                ]
              }
            }
          }
        ],
        included: [
          {
            lid: '666',
            type: 'companies',
            attributes: {
              name: 'Compeon GmbH',
              city: 'Düsseldorf'
            }
          },
          {
            id: '912',
            type: 'tags',
            attributes: {
              name: 'Banking'
            }
          },
          {
            id: '56',
            type: 'tags',
            attributes: {
              name: 'CEO'
            }
          }
        ]
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })

    describe('with deeply nested relationships', () => {
      const json = {
        data: {
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          id: '123',
          type: 'users',
          relationships: {
            company: {
              data: {
                id: '666',
                type: 'companies'
              }
            }
          }
        },
        included: [
          {
            id: '666',
            type: 'companies',
            relationships: {
              tags: {
                data: [
                  {
                    id: '12',
                    type: 'tags'
                  },
                  {
                    id: '17',
                    type: 'tags'
                  }
                ]
              }
            }
          }
        ]
      }

      const faultyJson = {
        data: {
          id: '823',
          attributes: {
            name: 'Nico',
            lastName: 'Peters'
          },
          type: 'users',
          relationships: {
            company: {
              data: {
                id: '666',
                type: 'companies'
              }
            }
          }
        },
        included: [
          {
            id: '666',
            type: 'companies',
            attributes: {
              name: 'Compeon Gmbh'
            },
            relationships: {
              tags: {
                data: [{
                  id: '12',
                  type: 'tags',
                  attributes: {
                    faultyAttribute: 'do not deserialize this!'
                  }
                }]
              }
            }
          }
        ]
      }

      it('deserializes the json', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })

      it('does not deserialize attributes directly included in a relation', () => {
        expect(deserialize()(faultyJson)).toMatchSnapshot()
      })
    })
  })

  describe('with empty relationships', () => {
    const json = {
      data: {
        attributes: {
          firstName: 'Nico',
          lastName: 'Peters'
        },
        id: '123',
        type: 'users',
        relationships: {
          company: {
            data: null
          },
          colleagues: {
            data: []
          }
        }
      }
    }

    it('renders the empty relationships', () => {
      expect(deserialize()(json)).toMatchSnapshot()
    })
  })

  describe('with relationships that have no identifier', () => {
    const json = {
      data: {
        attributes: {
          firstName: 'Nico',
          lastName: 'Peters'
        },
        id: '123',
        type: 'users',
        relationships: {
          company: {
            data: {
              type: 'companies'
            }
          }
        }
      },
      included: [
        {
          type: 'companies',
          attributes: {
            name: 'Compeon'
          }
        }
      ]
    }

    it('renders an empty relationship', () => {
      expect(deserialize()(json)).toMatchSnapshot()
    })
  })

  describe('with links', () => {
    describe('when on the root level', () => {
      describe('with a single resource', () => {
        const json = {
          data: {
            id: '123',
            type: 'users',
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            }
          },
          links: {
            dashboard: {
              url: 'http://example.com',
              meta: {
                title: 'Dashboard'
              }
            }
          }
        }

        it('deserializes the links', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })

      describe('with a resource array', () => {
        const json = {
          data: [
            {
              id: '123',
              type: 'users',
              attributes: {
                firstName: 'Nico',
                lastName: 'Peters'
              }
            },
            {
              id: '124',
              type: 'users',
              attributes: {
                firstName: 'Karl',
                lastName: 'Maschmann'
              }
            }
          ],
          links: {
            dashboard: {
              url: 'http://example.com',
              meta: {
                title: 'Dashboard'
              }
            }
          }
        }

        it('deserializes the links', () => {
          expect(deserialize()(json)).toMatchSnapshot()
        })
      })
    })
  })

  describe('when on the resource level', () => {
    describe('with a single resource', () => {
      const json = {
        data: {
          id: '123',
          type: 'users',
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          links: {
            self: 'http://some-url.com/123'
          }
        }
      }

      it('deserializes the links', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })

    describe('with a resource array', () => {
      const json = {
        data: [
          {
            id: '123',
            type: 'users',
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            links: {
              self: 'http://some-url.com/123'
            }
          },
          {
            id: '124',
            type: 'users',
            attributes: {
              firstName: 'Karl',
              lastName: 'Maschmann'
            },
            links: {
              self: 'http://some-url.com/124'
            }
          }
        ]
      }

      it('deserializes the links', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })
  })

  describe('with root and resource level links', () => {
    describe('with a single resource', () => {
      const json = {
        data: {
          id: '123',
          type: 'users',
          attributes: {
            firstName: 'Nico',
            lastName: 'Peters'
          },
          links: {
            self: 'http://some-url.com/123'
          }
        },
        links: {
          dashboard: {
            url: 'http://example.com',
            meta: {
              title: 'Dashboard'
            }
          }
        }
      }

      it('deserializes the links', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })

    describe('with a resource array', () => {
      const json = {
        data: [
          {
            id: '123',
            type: 'users',
            attributes: {
              firstName: 'Nico',
              lastName: 'Peters'
            },
            links: {
              self: 'http://some-url.com/123'
            }
          },
          {
            id: '124',
            type: 'users',
            attributes: {
              firstName: 'Karl',
              lastName: 'Maschmann'
            },
            links: {
              self: 'http://some-url.com/124'
            }
          }
        ],
        links: {
          dashboard: {
            url: 'http://example.com',
            meta: {
              title: 'Dashboard'
            }
          }
        }
      }

      it('deserializes the links', () => {
        expect(deserialize()(json)).toMatchSnapshot()
      })
    })
  })
})
