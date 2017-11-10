import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs, resolvers } from './resources';

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
