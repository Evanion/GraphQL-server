// @flow
import { GraphQLError } from 'graphql';
import Validate from '../../utilities/Validate';
import validatePassword from './validatePassword';
import hashPassword from './hashPassword';
import checkUsername from './checkUsername';

export default (async function removePost(id: Object, model: Object) {
  try {
    return Boolean(model.delete(id));
  } catch (err) {
    if (err.errors || err.code) {
      throw new GraphQLError('UNABLE_TO_REMOVE_POST');
    }
    throw new GraphQLError(err);
  }
});
