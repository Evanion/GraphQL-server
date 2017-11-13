import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

import tryLogin from '../helpers/tryLogin';
import createPost from '../helpers/createPost';
import createUser from '../helpers/createUser';
import updateUser from '../helpers/updateUser';
import updatePost from '../helpers/updatePost';
import removePost from '../helpers/removePost';
import { isAuthenticated, isOwnerOrAdmin } from '../../utilities/Authorization';
import loginResponse from './loginResponse';
import registerResponse from './registerResponse';
import userUpdateResponse from './userUpdateResponse';
import post from './post';

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutate the documents in the application',
  fields: {
    login: {
      type: loginResponse,
      description: `Login to the application. 
      This mutation will return a token and refreshToken as well as allow you to query for the user object. 
      Please note that you can only query for public fields at this time.`,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { email, password }, { db, secret, refreshSecret }) =>
        tryLogin(email, password, db.User, secret, refreshSecret)
    },
    register: {
      type: registerResponse,
      description: 'Register a new user. The user will need to be verified before you can login.',
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, args, { db }) => createUser(args, db.User)
    },
    userUpdate: {
      type: userUpdateResponse,
      description: 'Update a user',
      args: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        newPassword: { type: GraphQLString },
        username: { type: GraphQLString }
      },
      policies: [isOwnerOrAdmin],
      resolve: (root, args, { db, user }) => updateUser(args, db.User, user)
    },
    userVerify: {
      type: GraphQLBoolean,
      description: 'Verify a new user',
      args: {
        verifyToken: { type: GraphQLString },
        password: { type: GraphQLString },
        newPassword: { type: GraphQLString },
        username: { type: GraphQLString }
      },
      policies: [isOwnerOrAdmin],
      resolve: (root, args, { db, user }) => updateUser(args, db.User, user)
    },
    postCreate: {
      type: post,
      description: 'Create a new thread in the forum',
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString }
      },
      policies: [isAuthenticated],
      resolve: (root, args, { db, user }) => createPost(args, db, user)
    },
    postUpdate: {
      type: post,
      description: 'Update a thread in the forum',
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString }
      },
      policies: [isOwnerOrAdmin],
      resolve: (root, args, { db, user }) => updatePost(args, db, user)
    },
    postRemove: {
      type: GraphQLBoolean,
      description: 'Delete a thread in the forum',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      policies: [isOwnerOrAdmin],
      resolve: (root, args, { db }) => removePost(args, db.models.Post)
    }
  }
});

export default mutation;
