import { sampleMonsters, sampleLocations } from "../../data/sampleData";
import { GraphQLResolveInfo } from "graphql";
import { Monster } from "../../models/Monster";

interface StringFilterInput {
  eq?: string;
  contains?: string;
  ne?: string;
  notContains?: string;
}

interface SortInput {
  field: keyof Monster;
  order: "ASC" | "DESC";
}

interface PaginationInput {
  offset?: number;
  limit?: number;
}

interface MonsterFilterInput {
  name?: StringFilterInput;
  type?: StringFilterInput;
  sort?: SortInput;
  pagination?: PaginationInput;
}

interface CreateMonsterInput {
  name: string;
  type: string;
  weakness: string[];
  locationId: string;
}

interface UpdateMonsterInput {
  name?: string;
  type?: string;
  weakness?: string[];
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

const applySorting = (data: Monster[], sort?: SortInput): Monster[] => {
  if (!sort) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    const multiplier = sort.order === "ASC" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * multiplier;
    }

    return 0;
  });
};

const applyPagination = (data: Monster[], pagination?: PaginationInput): Monster[] => {
  if (!pagination) return data;

  const offset = pagination.offset || 0;
  const limit = pagination.limit || data.length;

  return data.slice(offset, offset + limit);
};

const monsterResolvers = {
  Query: {
    monsters: (
      _parent: never,
      { filter }: { filter?: MonsterFilterInput },
      _info: GraphQLResolveInfo
    ): Monster[] => {
      let result = sampleMonsters;

      if (filter) {
        result = sampleMonsters.filter((monster) => {
          if (filter.name && !filterString(monster.name, filter.name))
            return false;
          if (filter.type && !filterString(monster.type, filter.type))
            return false;
          return true;
        });

        result = applySorting(result, filter.sort);
        result = applyPagination(result, filter.pagination);
      }

      return result;
    },

    monster: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): Monster | null => {
      return sampleMonsters.find((mon) => mon.id === id) || null;
    },
  },

  Mutation: {
    createMonster: (
      _parent: never,
      { input }: { input: CreateMonsterInput },
      _info: GraphQLResolveInfo
    ): Monster => {
      const location = sampleLocations.find((loc) => loc.id === input.locationId);
      if (!location) throw new Error(`Location with ID ${input.locationId} not found`);

      const newMonster: Monster = {
        id: (sampleMonsters.length + 1).toString(),
        name: input.name,
        type: input.type,
        weakness: input.weakness,
        locationId: input.locationId,
      };
      sampleMonsters.push(newMonster);

      location.monsters.push(newMonster.id);

      return newMonster;
    },

    updateMonster: (
      _parent: never,
      { id, input }: { id: string; input: UpdateMonsterInput },
      _info: GraphQLResolveInfo
    ): Monster | null => {
      const index = sampleMonsters.findIndex((mon) => mon.id === id);
      if (index === -1) throw new Error("Monster not found");

      const monster = sampleMonsters[index];

      if (input.locationId && input.locationId !== monster.locationId) {
        const oldLocation = sampleLocations.find((loc) => loc.id === monster.locationId);
        if (oldLocation) {
          oldLocation.monsters = oldLocation.monsters.filter((monId) => monId !== monster.id);
        }

        const newLocation = sampleLocations.find((loc) => loc.id === input.locationId);
        if (!newLocation) throw new Error(`Location with ID ${input.locationId} not found`);

        newLocation.monsters.push(monster.id);
      }

      const updatedMonster = {
        ...monster,
        ...input,
      };
      sampleMonsters[index] = updatedMonster;

      return updatedMonster;
    },

    deleteMonster: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): boolean => {
      const index = sampleMonsters.findIndex((mon) => mon.id === id);
      if (index === -1) return false;

      const monster = sampleMonsters[index];

      const location = sampleLocations.find((loc) => loc.id === monster.locationId);
      if (location) {
        location.monsters = location.monsters.filter((monId) => monId !== monster.id);
      }

      sampleMonsters.splice(index, 1);

      return true;
    },
  },

  Monster: {
    location: (monster: Monster) => {
      return sampleLocations.find((loc) => loc.id === monster.locationId) || null;
    },
  },
};

export default monsterResolvers;
