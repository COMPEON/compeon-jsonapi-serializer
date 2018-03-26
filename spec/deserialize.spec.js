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
          }
        }
      }
    }

    it('ignores the relationship', () => {
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

    it('ignores the relationship', () => {
      expect(deserialize()(json)).toMatchSnapshot()
    })
  })
})
