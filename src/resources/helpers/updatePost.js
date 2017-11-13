// @flow
import { GraphQLError } from 'graphql';
import Validate from '../../utilities/Validate';
import validatePassword from './validatePassword';
import hashPassword from './hashPassword';
import checkUsername from './checkUsername';

export default (async function updatePost(data: Object, model: Object, authUser: Object) {
  const parsedPost = {};
  const id = data.id || authUser.id;

  // find user
  const user = await model.User.findById(id);
  const post = await model.Post.findById(data.id);

  if (!Validate(data.title, 'post.title')) {
    throw new GraphQLError('INVALID_TITLE');
  }

  if (!Validate(data.body, 'post.body')) {
    throw new GraphQLError('INVALID_BODY');
  }

  if (data.status && !Validate(data.status, 'post.status')) {
    throw new GraphQLError('INVALID_STATUS');
  }

  parsedPost.updatedBy = user.id;
  const updatedPost = Object.assign(post, parsedPost);

  try {
    const result = updatedPost.save();
    return {
      post: result
    };
  } catch (err) {
    if (err.errors || err.code) {
      throw new GraphQLError('UNABLE_TO_UPDATE_POST');
    }
    throw new GraphQLError(err);
  }
});
