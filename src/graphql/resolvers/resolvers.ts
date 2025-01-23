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
};

export default resolvers;