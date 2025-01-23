import { sampleLocations, sampleCharacters, sampleMonsters } from "../../data/sampleData";
import { GraphQLResolveInfo } from "graphql";
import { Location } from "../../models/Location";

interface StringFilterInput {
  eq?: string;
  contains?: string;
  ne?: string;
  notContains?: string;
}

interface SortInput {
  field: keyof Location;
  order: "ASC" | "DESC";
}

interface PaginationInput {
  offset?: number;
  limit?: number;
}

interface LocationFilterInput {
  name?: StringFilterInput;
  region?: StringFilterInput;
  description?: StringFilterInput;
  sort?: SortInput;
  pagination?: PaginationInput;
}

interface CreateLocationInput {
  name: string;
  region: string;
  description: string;
  characters?: string[];
  monsters?: string[];
}

interface UpdateLocationInput {
  name?: string;
  region?: string;
  description?: string;
  characters?: string[];
  monsters?: string[];
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

const applySorting = (data: Location[], sort?: SortInput): Location[] => {
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

const applyPagination = (data: Location[], pagination?: PaginationInput): Location[] => {
  if (!pagination) return data;

  const offset = pagination.offset || 0;
  const limit = pagination.limit || data.length;

  return data.slice(offset, offset + limit);
};

const locationResolvers = {
  Query: {
    locations: (
      _parent: never,
      { filter }: { filter?: LocationFilterInput },
      _info: GraphQLResolveInfo
    ): Location[] => {
      let result = sampleLocations;

      if (filter) {
        result = sampleLocations.filter((location) => {
          if (filter.name && !filterString(location.name, filter.name))
            return false;
          if (filter.region && !filterString(location.region, filter.region))
            return false;
          if (
            filter.description &&
            !filterString(location.description, filter.description)
          )
            return false;
          return true;
        });

        result = applySorting(result, filter.sort);
        result = applyPagination(result, filter.pagination);
      }

      return result;
    },

    location: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): Location | null => {
      return sampleLocations.find((loc) => loc.id === id) || null;
    },
  },

  Mutation: {
    createLocation: (
        _parent: never,
        { input }: { input: CreateLocationInput },
        _info: GraphQLResolveInfo
      ): Location => {
        const newLocation: Location = {
          id: (sampleLocations.length + 1).toString(),
          name: input.name,
          region: input.region,
          description: input.description,
          characters: [],
          monsters: [],
        };
      
        sampleLocations.push(newLocation);
        return newLocation;
      },
      
      updateLocation: (
        _parent: never,
        { id, input }: { id: string; input: UpdateLocationInput },
        _info: GraphQLResolveInfo
      ): Location | null => {
        const index = sampleLocations.findIndex((loc) => loc.id === id);
        if (index === -1) throw new Error("Location not found");
      
        const updatedLocation: Location = {
          ...sampleLocations[index],
          name: input.name || sampleLocations[index].name,
          region: input.region || sampleLocations[index].region,
          description: input.description || sampleLocations[index].description,
        };
      
        sampleLocations[index] = updatedLocation;
        return updatedLocation;
      },
      

    deleteLocation: (
      _parent: never,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ): boolean => {
      const index = sampleLocations.findIndex((loc) => loc.id === id);
      if (index === -1) return false;

      sampleLocations.splice(index, 1);
      return true;
    },
  },
};

export default locationResolvers;
