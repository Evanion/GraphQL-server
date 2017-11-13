import { GraphQLError } from 'graphql';

export default (root, args, { user }, info) => {
  if (!(user && user.id)) {
    throw new GraphQLError('REQUIRES_AUTHENTICATION');
  }
};
