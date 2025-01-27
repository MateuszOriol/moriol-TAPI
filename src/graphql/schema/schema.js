const schema = `
scalar Date

# Common Types
input StringFilter {
  eq: String
  contains: String
  notEq: String
  notContains: String
}

input NumberFilter {
  eq: Int
  gt: Int
  lt: Int
  gte: Int
  lte: Int
}

input DateFilter {
  eq: Date
  gt: Date
  lt: Date
  gte: Date
  lte: Date
}

input SortInput {
  field: String!
  order: SortOrder = ASC
}

enum SortOrder {
  ASC
  DESC
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Models
type Character {
  id: ID!
  name: String!
  race: String!
  profession: String!
  age: Int!
  favouriteLocation: Location
}

type Location {
  id: ID!
  name: String!
  region: String!
  description: String!
  characters: [Character!]!
  monsters: [Monster!]!
}

type Monster {
  id: ID!
  name: String!
  type: String!
  weakness: [String!]!
  favouriteLocation: Location
}

# Filters
input CharacterFilter {
  name: StringFilter
  race: StringFilter
  profession: StringFilter
  age: NumberFilter
  favouriteLocation: StringFilter
}

input LocationFilter {
  name: StringFilter
  region: StringFilter
  description: StringFilter
}

input MonsterFilter {
  name: StringFilter
  type: StringFilter
  favouriteLocation: StringFilter
}

# Inputs
input CharacterInput {
  name: String!
  race: String!
  profession: String!
  age: Int!
  favouriteLocation: String
}

input LocationInput {
  name: String!
  region: String!
  description: String!
}

input MonsterInput {
  name: String!
  type: String!
  weakness: [String!]!
  favouriteLocation: String
}

# Connections for Pagination
type CharacterConnection {
  edges: [CharacterEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CharacterEdge {
  node: Character!
  cursor: String!
}

type LocationConnection {
  edges: [LocationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type LocationEdge {
  node: Location!
  cursor: String!
}

type MonsterConnection {
  edges: [MonsterEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type MonsterEdge {
  node: Monster!
  cursor: String!
}

# Queries
type Query {
  characters(
    filter: CharacterFilter
    sort: SortInput
    page: Int = 1
    pageSize: Int = 10
  ): CharacterConnection!
  character(id: ID!): Character

  locations(
    filter: LocationFilter
    sort: SortInput
    page: Int = 1
    pageSize: Int = 10
  ): LocationConnection!
  location(id: ID!): Location

  monsters(
    filter: MonsterFilter
    sort: SortInput
    page: Int = 1
    pageSize: Int = 10
  ): MonsterConnection!
  monster(id: ID!): Monster
}

# Mutations
type Mutation {
  createCharacter(character: CharacterInput!): Character
  updateCharacter(id: ID!, character: CharacterInput!): Character
  deleteCharacter(id: ID!): Boolean

  createLocation(location: LocationInput!): Location
  updateLocation(id: ID!, location: LocationInput!): Location
  deleteLocation(id: ID!): Boolean

  createMonster(monster: MonsterInput!): Monster
  updateMonster(id: ID!, monster: MonsterInput!): Monster
  deleteMonster(id: ID!): Boolean
}
`;
export default schema;