// @flow
import { GraphQLError } from 'graphql';
import Validate from '../../utilities/Validate';

const postObject = {
  title: String,
  body: String,
  status: String
};

export default (async function createPost(data: postObject, models: Object, user: Object) {
  const parsedPost = {};
  if (!data.title || !data.body) {
    throw new GraphQLError('INVALID_PAYLOAD');
  }

  if (!Validate(data.title, 'post.title')) {
    throw new GraphQLError('INVALID_TITLE');
  }

  if (!Validate(data.body, 'post.body')) {
    throw new GraphQLError('INVALID_BODY');
  }

  if (data.status && !Validate(data.status, 'post.status')) {
    throw new GraphQLError('INVALID_STATUS');
  }
  try {
    parsedPost.title = data.title;
    parsedPost.body = data.body;
    if (data.status) parsedPost.status = data.status;
    parsedPost.author = user.id;
    return await models.Post.create(parsedPost);
  } catch (err) {
    throw new GraphQLError(err);
  }
});
