import { GraphQLError } from 'graphql';

export default (root, args, { user }, info) => {
  const isOwner = root.author === user.id;
  const adminRoles = ['admin', 'super-user'];
  const isAdmin = user.roles.filter(role => adminRoles.indexOf(role) > -1);

  if (!isAdmin.length && isOwner) {
    throw new GraphQLError('NOT_ADMIN');
  }
};
