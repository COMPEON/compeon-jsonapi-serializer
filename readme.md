# COMPEON JSON API Serializer

A **client-side** serialization and deserialization library for JSON API which supports local ids (`lid`) with sidepostings. That means it is possible to serialize relationships with includes, even when the actual relationship doesn't exist yet. This accounts to the status quo of the JSON API 1.1 spec draft: https://github.com/json-api/json-api/pull/1197

**WARNING**: This library supports basic serialization and deserialization and is far from completely supporting the full JSON API specification.

## Installation

`yarn add @compeon-os/jsonapi-serializer`

## Usage

### Serialization

```javascript
serialize(type, options)(data)
```
**type**:

The resource type that will be rendered for the root resource.

**options**:

- `attributes`: An array of whitelisted attributes. Relationships have to be included.
- `relationships`:
  - `<Name of relationship>`: Options for this relationship. Can define attributes and relationships recursively again.
      - `type`: The type to render for resources from this relationship.


#### Example

```javascript
import { serialize } from '@compeon-os/jsonapi-serializer'
// or import { serialize, withPolymorphicType } from '@compeon-os/jsonapi-serializer'

const data = {
  firstName: 'Arthur',
  lastName: 'Dent',
  planet: {
    id: '6126',
    // or
    lid: '79862106-6aac-4a66-9553-d1453fc267de',
    name: 'Earth'
  },
  orbiters: [
    withPolymorphicType('satellites', {
      id: '42',
      name: 'Not So Deep Thought'
    })
  ]
  // alternatively you may apply the type to all entries in the relationship:
  // orbiters: withPolymorphicType('satellites', [
  //   {
  //     id: '42',
  //     name: 'Not So Deep Thought'
  //   },
  //   ...
  // ])
  )
}

const options = {
  attributes: ['firstName', 'lastName', 'planet'],
  relationships: {
    planet: {
      attributes: ['name'],
      type: 'planets'
    },
    orbiters: {
      attributes: ['name'],
      type: 'polymorphic'
    }
  }
}

const organismSerializer = serialize('organisms', options)
const json = organismSerializer(data)

```

will serialize to

```javascript
{
  data: {
    type: 'organisms',
    attributes: {
      firstName: 'Arthur',
      lastName: 'Dent'
    },
    relationships: {
      planet: {
        data: {
          id: '6126',
          // or
          lid: '79862106-6aac-4a66-9553-d1453fc267de',
          type: 'planets'
        }
      },
      orbiters: {
        data: [
          {
            id: '42',
            type: 'satellites'
          }
        ]
      }
    }
  },
  included: [
    {
      id: '6126',
      // or
      lid: '79862106-6aac-4a66-9553-d1453fc267de',
      type: 'planets',
      attributes: {
        name: 'Earth'
      }
    },
    {
      id: '42',
      type: 'satellites',
      attributes: {
        name: 'Not So Deep Thought'
      }
    }
  ]
}
```

### Deserialization

```javascript
deserialize(options)(json)
```

**Options**: There are no options available for this factory function yet.


#### Example

```javascript
import { deserialize } from '@compeon-os/jsonapi-serializer'


const json = {
  data: {
    id: '123',
    type: 'organisms',
    attributes: {
      firstName: 'Arthur',
      lastName: 'Dent'
    },
    relationships: {
      planet: {
        data: {
          id: '6126',
          // or
          lid: '79862106-6aac-4a66-9553-d1453fc267de',
          type: 'planets'
        }
      }
    },
    links: {
      self: 'http://example.com/resource-link'
    }
  },
  included: [
    {
      id: '6126',
      // or
      lid: '79862106-6aac-4a66-9553-d1453fc267de',
      type: 'planets',
      attributes: {
        name: 'Earth'
      }
    }
  ],
  links: {
    dashboard: {
      url: 'http://example.com/root-link',
      meta: {
        title: 'Dashboard'
      }
    }
  }
}

const data = deserialize()(json)

```

will deserialize to

```javascript
{
  firstName: 'Arthur',
  id: '123',
  lastName: 'Dent',
  links: {
    self: 'http://example.com/resource-link'
  },
  rootLinks: {
    dashboard: {
      url: 'http://example.com/root-link',
      meta: {
        title: 'Dashboard'
      }
    },
  },
  planet: {
    id: '6126',
    // or
    lid: '79862106-6aac-4a66-9553-d1453fc267de',
    name: 'Earth'
  }
}
```

## Todo

- [ ] Detect cyclic relationships on deserialization
- [ ] Support full JSON API 1.0

## License

MIT
