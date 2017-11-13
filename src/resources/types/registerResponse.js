import { GraphQLObjectType } from 'graphql';
import user from './user';

const registerResponse = new GraphQLObjectType({
  name: 'RegisterResponse',
  fields: {
    user: {
      type: user
    }
  }
});

export default registerResponse;
