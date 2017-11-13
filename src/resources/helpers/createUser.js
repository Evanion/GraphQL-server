// @flow
import { GraphQLError } from 'graphql';
import Validate from '../../utilities/Validate';
import hashPassword from './hashPassword';

const userObject = {
  email: String,
  password: String,
  username: String
};

export default (async function createUser(data: userObject, model: Object) {
  const parsedUser = {};
  if (!data.email || !data.password || !data.username) {
    throw new GraphQLError('INVALID_PAYLOAD');
  }

  if (!Validate(data.email, 'user.email')) {
    throw new GraphQLError('INVALID_EMAIL');
  }

  if (!Validate(data.username, 'user.username')) {
    throw new GraphQLError('INVALID_USERNAME');
  }

  if (!Validate(data.password, 'user.password')) {
    throw new GraphQLError('INVALID_PASSWORD');
  }
  try {
    parsedUser.username = data.username;
    parsedUser.email = data.email.toLowerCase();
    parsedUser.password = await hashPassword(data.password);
    const user = await model.create(parsedUser);
    return { user };
  } catch (err) {
    throw new GraphQLError(err);
  }
});
