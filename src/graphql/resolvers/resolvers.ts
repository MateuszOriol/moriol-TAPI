import characterResolvers from "./characterResolvers";
import locationResolvers from "./locationResolvers";
import monsterResolvers from "./monsterResolvers";

const resolvers = {
  Query: {
    ...characterResolvers.Query,
    ...locationResolvers.Query,
    ...monsterResolvers.Query,
  },
  Mutation: {
    ...characterResolvers.Mutation,
    ...locationResolvers.Mutation,
    ...monsterResolvers.Mutation,
  },
  Character: {
    ...characterResolvers.Character,
  },
  Location: {
    ...locationResolvers.Location,
  },
  Monster: {
    ...monsterResolvers.Monster,
  },
};

export default resolvers;