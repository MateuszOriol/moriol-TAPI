import { GraphQLScalarType } from 'graphql';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  
  serialize(value) {
    if (!value) return null;
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return value;
  },
  
  parseValue(value) {
    if (!value) return null;
    return new Date(value).toISOString().split('T')[0];
  },
  
  parseLiteral(ast) {
    if (ast.kind === 'StringValue') {
      return new Date(ast.value).toISOString().split('T')[0];
    }
    return null;
  }
});