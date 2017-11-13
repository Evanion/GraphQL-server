// @flow
import { GraphQLError } from 'graphql';
import Validate from '../../utilities/Validate';
import validatePassword from './validatePassword';
import hashPassword from './hashPassword';
import checkUsername from './checkUsername';

export default (async function updateUser(payload: Object, model: Object, authUser: Object) {
  const parsedUser = {};
  const id = payload.id || authUser.id;
  const adminRoles = ['admin', 'super-user'];
  if (
    payload.id &&
    payload.id !== authUser.id &&
    authUser.roles.filter(role => adminRoles.indexOf(role) > -1)
  ) {
    throw new GraphQLError('NOT_ADMIN');
  }

  // find user
  const user = await model.findById(id);

  if (payload.email && payload.email !== user.email) {
    if (!Validate(payload.email, 'user.email')) {
      throw new GraphQLError('INVALID_EMAIL');
    }
    if (!await validatePassword(payload.password, user.password)) {
      throw new GraphQLError('INCORRECT_PASSWORD');
    }
    parsedUser.email = payload.email;
  }

  /* If the user wants to change their password,
     * they have to supply their old password
     */
  if (payload.newPassword && payload.password) {
    if (!Validate(payload.newPassword, 'user.password')) {
      throw new GraphQLError('INVALID_NEW_PASSWORD');
    }

    if (!Validate(payload.password, 'user.password')) {
      throw new GraphQLError('INVALID_PASSWORD');
    }

    if (!await validatePassword(payload.password, user.password)) {
      throw new GraphQLError('INCORRECT_PASSWORD');
    }
    parsedUser.password = await hashPassword(payload.newPassword);
  }

  /* If the user wants to change the username
     * we need to check that it is available
     * and finally update the slug
     */
  if (payload.username !== user.username) {
    if (!Validate(payload.username, 'user.username') || checkUsername(payload.username, model)) {
      throw new GraphQLError('INVALID_USERNAME');
    }
    parsedUser.username = payload.username;
  }
  const updatedUser = Object.assign(user, parsedUser);

  try {
    const result = updatedUser.save();
    return {
      user: result
    };
  } catch (err) {
    if (err.errors || err.code) {
      throw new GraphQLError('UNABLE_TO_UPDATE_USER');
    }
    throw new GraphQLError(err);
  }
});
