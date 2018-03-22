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

  describe('with relationships', () => {
    describe('with valid relationships', () => {
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
      })

      describe('with includes', () => {
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
                  name: 'Compeong 4.0 GmbH',
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
                  name: 'Compeong 4.0 GmbH',
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
  })
})
