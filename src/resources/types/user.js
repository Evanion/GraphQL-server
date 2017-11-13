import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import GraphQLDate from 'graphql-date';
import { isOwner } from '../../utilities/Authorization';

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    status: {
      type: new GraphQLNonNull(GraphQLString)
    },
    roles: {
      type: new GraphQLList(GraphQLString)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDate)
    },
    updatedAt: {
      type: GraphQLDate
    },
    email: {
      policies: [isOwner],
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export default User;
