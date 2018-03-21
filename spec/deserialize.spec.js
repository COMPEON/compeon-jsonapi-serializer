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
})
