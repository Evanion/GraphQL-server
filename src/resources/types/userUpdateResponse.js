import { GraphQLObjectType } from 'graphql';
import user from './user';

const userUpdateResponse = new GraphQLObjectType({
  name: 'UserUpdateResponse',
  fields: {
    user: {
      type: user
    }
  }
});

export default userUpdateResponse;
