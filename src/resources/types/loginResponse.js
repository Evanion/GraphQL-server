import { GraphQLObjectType, GraphQLString } from 'graphql';
import user from './user';

const loginResponse = new GraphQLObjectType({
  name: 'LoginResponse',
  fields: {
    token: {
      type: GraphQLString
    },
    refreshToken: {
      type: GraphQLString
    },
    user: {
      type: user
    }
  }
});

export default loginResponse;
