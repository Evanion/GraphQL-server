import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';
import user from './user';

const Reply = new GraphQLObjectType({
  name: 'Reply',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    author: {
      type: new GraphQLNonNull(user)
    },
    body: {
      type: new GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDate)
    },
    updatedAt: {
      type: GraphQLDate
    },
    updatedBy: {
      type: user
    }
  }
});

export default Reply;
