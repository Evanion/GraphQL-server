import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import GraphQLDate from 'graphql-date';
import reply from './reply';
import user from './user';

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    author: {
      type: new GraphQLNonNull(user)
    },
    status: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    body: {
      type: new GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDate)
    },
    replies: {
      type: new GraphQLList(reply)
    },
    updatedAt: {
      type: GraphQLDate
    },
    updatedBy: {
      type: user
    }
  }
});

export default Post;
