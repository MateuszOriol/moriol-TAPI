import { sampleCharacters, sampleLocations, sampleMonsters } from '../../data/sampleData.js';
import { DateScalar } from '../customScalars.js';

// Utility functions for filtering, sorting, and pagination
const applyFilter = (value, filterValue) => {
  if (!filterValue) return true;
  if (filterValue.eq !== undefined) return value === filterValue.eq;
  if (filterValue.contains !== undefined)
    return String(value).toLowerCase().includes(String(filterValue.contains).toLowerCase());
  if (filterValue.notEq !== undefined) return value !== filterValue.notEq;
  if (filterValue.notContains !== undefined)
    return !String(value).toLowerCase().includes(String(filterValue.notContains).toLowerCase());
  if (filterValue.gt !== undefined) return value > filterValue.gt;
  if (filterValue.lt !== undefined) return value < filterValue.lt;
  if (filterValue.gte !== undefined) return value >= filterValue.gte;
  if (filterValue.lte !== undefined) return value <= filterValue.lte;
  return true;
};

const applyFilters = (items, filter) => {
  if (!filter) return items;
  return items.filter(item => {
    return Object.entries(filter).every(([key, filterValue]) => {
      const value = item[key];
      if (typeof filterValue === 'object' && !Array.isArray(filterValue) && filterValue !== null) {
        return applyFilter(value, filterValue);
      }
      return applyFilter(value, filterValue);
    });
  });
};

const applySorting = (collection, sort) => {
  if (!sort) return collection;
  return [...collection].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    const order = sort.order === 'DESC' ? -1 : 1;
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * order;
    }
    return (aVal - bVal) * order;
  });
};

const applyPagination = (collection, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return collection.slice(start, end);
};

const createConnection = (items, page, pageSize, totalCount) => {
  return {
    edges: items.map(item => ({
      node: item,
      cursor: Buffer.from(item.id.toString()).toString('base64'),
    })),
    pageInfo: {
      hasNextPage: page * pageSize < totalCount,
      hasPreviousPage: page > 1,
      startCursor: items[0]
        ? Buffer.from(items[0].id.toString()).toString('base64')
        : null,
      endCursor: items[items.length - 1]
        ? Buffer.from(items[items.length - 1].id.toString()).toString('base64')
        : null,
    },
    totalCount,
  };
};

// Resolvers
const resolvers = {
  Date: DateScalar,

  Query: {
    // Character resolvers
    characters: (_, { filter, sort, page = 1, pageSize = 10 }) => {
      let result = applyFilters(sampleCharacters, filter);
      result = applySorting(result, sort);
      const totalCount = result.length;
      result = applyPagination(result, page, pageSize);
      return createConnection(result, page, pageSize, totalCount);
    },
    character: (_, { id }) => sampleCharacters.find(c => c.id === id),

    // Location resolvers
    locations: (_, { filter, sort, page = 1, pageSize = 10 }) => {
      let result = applyFilters(sampleLocations, filter);
      result = applySorting(result, sort);
      const totalCount = result.length;
      result = applyPagination(result, page, pageSize);
      return createConnection(result, page, pageSize, totalCount);
    },
    location: (_, { id }) => sampleLocations.find(l => l.id === id),

    // Monster resolvers
    monsters: (_, { filter, sort, page = 1, pageSize = 10 }) => {
      let result = applyFilters(sampleMonsters, filter);
      result = applySorting(result, sort);
      const totalCount = result.length;
      result = applyPagination(result, page, pageSize);
      return createConnection(result, page, pageSize, totalCount);
    },
    monster: (_, { id }) => sampleMonsters.find(m => m.id === id),
  },

  Mutation: {
    // Character mutations
    createCharacter: (_, { character }) => {
      const newCharacter = { id: String(sampleCharacters.length + 1), ...character };
      sampleCharacters.push(newCharacter);
      return newCharacter;
    },
    updateCharacter: (_, { id, character }) => {
      const index = sampleCharacters.findIndex(c => c.id === id);
      if (index === -1) return null;
      sampleCharacters[index] = { ...sampleCharacters[index], ...character };
      return sampleCharacters[index];
    },
    deleteCharacter: (_, { id }) => {
      const index = sampleCharacters.findIndex(c => c.id === id);
      if (index === -1) return false;
      sampleCharacters.splice(index, 1);
      return true;
    },

    // Location mutations
    createLocation: (_, { location }) => {
      const newLocation = { id: String(sampleLocations.length + 1), ...location };
      sampleLocations.push(newLocation);
      return newLocation;
    },
    updateLocation: (_, { id, location }) => {
      const index = sampleLocations.findIndex(l => l.id === id);
      if (index === -1) return null;
      sampleLocations[index] = { ...sampleLocations[index], ...location };
      return sampleLocations[index];
    },
    deleteLocation: (_, { id }) => {
      const index = sampleLocations.findIndex(l => l.id === id);
      if (index === -1) return false;
      sampleLocations.splice(index, 1);
      return true;
    },

    // Monster mutations
    createMonster: (_, { monster }) => {
      const newMonster = { id: String(sampleMonsters.length + 1), ...monster };
      sampleMonsters.push(newMonster);
      return newMonster;
    },
    updateMonster: (_, { id, monster }) => {
      const index = sampleMonsters.findIndex(m => m.id === id);
      if (index === -1) return null;
      sampleMonsters[index] = { ...sampleMonsters[index], ...monster };
      return sampleMonsters[index];
    },
    deleteMonster: (_, { id }) => {
      const index = sampleMonsters.findIndex(m => m.id === id);
      if (index === -1) return false;
      sampleMonsters.splice(index, 1);
      return true;
    },
  },

  Character: {
    favouriteLocation: (character) => sampleLocations.find(l => l.id === character.favouriteLocation),
  },

  Location: {
    characters: (location) => sampleCharacters.filter(c => location.characters.includes(c.id)),
    monsters: (location) => sampleMonsters.filter(m => location.monsters.includes(m.id)),
  },

  Monster: {
    favouriteLocation: (monster) => sampleLocations.find(l => l.id === monster.favouriteLocation),
  },
};

export default resolvers;
