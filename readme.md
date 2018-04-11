# COMPEON JSON API Serializer

A **client-side** serialization and deserialization library for JSON API which supports local ids (`lid`) with sidepostings. That means it is possible to serialize relationships with includes, even when the actual relationship doesn't exist yet. This accounts to the status quo of the JSON API 1.1 spec draft: https://github.com/json-api/json-api/pull/1197

**WARNING**: This library supports basic serialization and deserialization and is far from completely supporting the full JSON API specification.

## Installation

`yarn add @compeon/jsonapi-serializer`

## Usage

### Serialization

```javascript
serialize(options)(data)
```

**Options**:

- `attributes`: An array of whitelisted attributes. Relationships have to be included.
- `relationships`:
  - `<Name of relationship>`: Options for this relationship. Can define attributes and relationships recursively again.
      - `type`: The type to render for resources from this relationship.


#### Example

```javascript
import { serialize } from '@compeon/jsonapi-serializer'

const data = {
  firstName: 'Arthur',
  lastName: 'Dent',
  planet: {
    id: '6126',
    // or
    lid: '79862106-6aac-4a66-9553-d1453fc267de',
    name: 'Earth'
  }
}

const options = {
  attributes: ['firstName', 'lastName', 'planet'],
  relationships: {
    planet: {
      attributes: ['name'],
      type: 'planets'
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
import { deserialize } from '@compeon/jsonapi-serializer'


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
      url: 'http://example.com',
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
    dashboard: {
      url: 'http://example.com',
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

Please note that right now **only root level links are deserialized**. Support for resource level links is planned for a future release.

## Todo

- [ ] Detect duplicate includes on serialization
- [ ] Detect cyclic relationships on deserialization
- [ ] Support full JSON API 1.0
- [ ] Develop a concept for deserializing resource level links as well

## License

MIT
