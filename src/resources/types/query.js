// @flow
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';
import { isAuthenticated } from '../../utilities/Authorization';
import checkUsername from '../helpers/checkUsername';
import User from './user';
import Post from './post';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ping: {
      type: GraphQLString,
      resolve: () => 'pong'
    },
    allUsers: {
      type: new GraphQLList(User),
      policies: [isAuthenticated],
      resolve: (root, args, { db }) => db.User.find()
    },
    allPosts: {
      type: new GraphQLList(Post),
      resolve: (root, args, { db }) => db.Post.find()
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      policies: [isAuthenticated],
      resolve: (root, args, { db }) => db.User.findById(args.id)
    },
    usernameTaken: {
      type: GraphQLBoolean,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { username }, { db }) => checkUsername(username, db.User)
    }
  }
});

export default Query;
