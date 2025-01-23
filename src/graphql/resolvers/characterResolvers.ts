import { sampleCharacters, sampleLocations } from "../../data/sampleData";
import { GraphQLResolveInfo } from "graphql";
import { Character } from "../../models/Character";
import { Location } from "../../models/Location";

interface StringFilterInput {
  eq?: string;
  contains?: string;
  ne?: string;
  notContains?: string;
}

interface SortInput {
  field: keyof Character;
  order: "ASC" | "DESC";
}

interface PaginationInput {
  offset?: number;
  limit?: number;
}

interface CharacterFilterInput {
  name?: StringFilterInput;
  race?: StringFilterInput;
  profession?: StringFilterInput;
  locationId?: StringFilterInput;
  sort?: SortInput;
  pagination?: PaginationInput;
}

interface CreateCharacterInput {
  name: string;
  race: string;
  profession: string;
  age: number;
  locationId: string;
}

interface UpdateCharacterInput {
  name?: string;
  race?: string;
  profession?: string;
  age?: number;
  locationId?: string;
}

const filterString = (value: string, filter?: StringFilterInput): boolean => {
  if (!filter) return true;

  if (filter.eq !== undefined && value !== filter.eq) return false;
  if (filter.ne !== undefined && value === filter.ne) return false;
  if (filter.contains !== undefined && !value.includes(filter.contains))
    return false;
  if (filter.notContains !== undefined && value.includes(filter.notContains))
    return false;

  return true;
};

const applySorting = (data: Character[], sort?: SortInput): Character[] => {
  if (!sort) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    const multiplier = sort.order === "ASC" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * multiplier;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * multiplier;
    }

    return 0;
  });
};

const applyPagination = (
  data: Character[],
  pagination?: PaginationInput
): Character[] => {
  if (!pagination) return data;

  const offset = pagination.offset || 0;
  const limit = pagination.limit || data.length;

  return data.slice(offset, offset + limit);
};

const characterResolvers = {
  Query: {
    characters: (
      _parent: never,
      { filter }: { filter?: CharacterFilterInput },
      _info: GraphQLResolveInfo
    ): (Character & { location: Location | undefined })[] => {
      let result = sampleCharacters;

      if (filter) {
        result = sampleCharacters.filter((character) => {
          if (filter.name && !filterString(character.name, filter.name))
            return false;
          if (filter.race && !filterString(character.race, filter.race))
            return false;
          if (
            filter.profession &&
            !filterString(character.profession, filter.profession)
          )
            return false;
          if (
            filter.locationId &&
            !filterString(character.locationId, filter.locationId)
          )
            return false;
          return true;
        });

        result = applySorting(result, filter.sort);
        result = applyPagination(result, filter.pagination);
      }

      return result.map((character) => ({
        ...character,
        location: sampleLocations.find((loc) => loc.id === character.locationId),
      }));
    },

    character: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): Character & { location: Location | undefined } | null => {
      const character = sampleCharacters.find((char) => char.id === id);
      if (!character) return null;

      return {
        ...character,
        location: sampleLocations.find((loc) => loc.id === character.locationId),
      };
    },
  },

  Mutation: {
    createCharacter: (
      _parent: never,
      { input }: { input: CreateCharacterInput },
      _info: GraphQLResolveInfo
    ): Character => {
      const location = sampleLocations.find(loc => loc.id === input.locationId);
      if (!location) throw new Error(`Location with ID ${input.locationId} not found`);

      const newCharacter: Character = {
        id: (sampleCharacters.length + 1).toString(),
        ...input,
      };
      sampleCharacters.push(newCharacter);

      location.characters.push(newCharacter.id);

      return newCharacter;
    },

    updateCharacter: (
      _parent: never,
      { id, input }: { id: string; input: UpdateCharacterInput },
      _info: GraphQLResolveInfo
    ): Character | null => {
      const index = sampleCharacters.findIndex((char) => char.id === id);
      if (index === -1) throw new Error("Character not found");

      const character = sampleCharacters[index];

      if (input.locationId && input.locationId !== character.locationId) {
        const oldLocation = sampleLocations.find(loc => loc.id === character.locationId);
        if (oldLocation) {
          oldLocation.characters = oldLocation.characters.filter(charId => charId !== character.id);
        }

        const newLocation = sampleLocations.find(loc => loc.id === input.locationId);
        if (!newLocation) throw new Error(`Location with ID ${input.locationId} not found`);
        newLocation.characters.push(character.id);
      }

      const updatedCharacter = {
        ...character,
        ...input,
      };
      sampleCharacters[index] = updatedCharacter;

      return updatedCharacter;
    },

    deleteCharacter: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): boolean => {
      const index = sampleCharacters.findIndex((char) => char.id === id);
      if (index === -1) return false;

      const character = sampleCharacters[index];

      const location = sampleLocations.find(loc => loc.id === character.locationId);
      if (location) {
        location.characters = location.characters.filter(charId => charId !== character.id);
      }

      sampleCharacters.splice(index, 1);

      return true;
    },
  },
};

export default characterResolvers;
