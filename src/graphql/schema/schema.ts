import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  enum SortOrder {
    ASC
    DESC
  }

  input SortInput {
    field: String!
    order: SortOrder!
  }

  input PaginationInput {
    offset: Int
    limit: Int
  }

  input StringFilterInput {
    eq: String
    contains: String
    ne: String
    notContains: String
  }

  input CharacterFilterInput {
    name: StringFilterInput
    race: StringFilterInput
    profession: StringFilterInput
    locationId: StringFilterInput
    sort: SortInput
    pagination: PaginationInput
  }

  input CreateCharacterInput {
    name: String!
    race: String!
    profession: String!
    age: Int!
    locationId: String
  }

  input UpdateCharacterInput {
    name: String
    race: String
    profession: String
    age: Int
    locationId: String
  }

  input LocationFilterInput {
    name: StringFilterInput
    region: StringFilterInput
    description: StringFilterInput
    sort: SortInput
    pagination: PaginationInput
  }

  input CreateLocationInput {
    name: String!
    region: String!
    description: String!
  }

  input UpdateLocationInput {
    name: String
    region: String
    description: String
  }

  input MonsterFilterInput {
    name: StringFilterInput
    type: StringFilterInput
    sort: SortInput
    pagination: PaginationInput
  }

  input CreateMonsterInput {
    name: String!
    type: String!
    weakness: [String!]!
    locationId: String!
  }

  input UpdateMonsterInput {
    name: String
    type: String
    weakness: [String!]
    locationId: String
  }

  type Character {
    id: ID!
    name: String!
    race: String!
    profession: String!
    age: Int!
    locationId: String
  }

  type Location {
    id: ID!
    name: String!
    region: String!
    description: String!
    characters: [String!] # List of character IDs
    monsters: [String!] # List of monster IDs
  }

  type Monster {
    id: ID!
    name: String!
    type: String!
    weakness: [String!]!
    locationId: String!
  }

  type Query {
    characters(filter: CharacterFilterInput): [Character!]!
    character(id: ID!): Character

    locations(filter: LocationFilterInput): [Location!]!
    location(id: ID!): Location

    monsters(filter: MonsterFilterInput): [Monster!]!
    monster(id: ID!): Monster
  }

  type Mutation {
    createCharacter(input: CreateCharacterInput!): Character!
    updateCharacter(id: ID!, input: UpdateCharacterInput!): Character!
    deleteCharacter(id: ID!): Boolean!

    createLocation(input: CreateLocationInput!): Location!
    updateLocation(id: ID!, input: UpdateLocationInput!): Location!
    deleteLocation(id: ID!): Boolean!

    createMonster(input: CreateMonsterInput!): Monster!
    updateMonster(id: ID!, input: UpdateMonsterInput!): Monster!
    deleteMonster(id: ID!): Boolean!
  }
`;

export default typeDefs;
