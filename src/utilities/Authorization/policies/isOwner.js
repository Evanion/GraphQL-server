import { GraphQLError } from 'graphql';

export default (root, args, context, info) => {
  if (!(context.user && context.user.id !== root._id)) {
    throw new GraphQLError('NOT_OWNER');
  }
};
