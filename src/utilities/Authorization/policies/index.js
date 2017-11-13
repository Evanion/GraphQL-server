import util from 'util';
import isAdmin from './isAdmin';
import isAuthenticated from './isAuthenticated';
import isOwner from './isOwner';
import isOwnerOrAdmin from './isOwnerOrAdmin';
import wrapResolver from './wrapResolver';

export default function policies(schema) {
  Object.keys(schema._typeMap).forEach(typName => {
    const typ = schema._typeMap[typName];
    if (!typ._fields) {
      return;
    }
    // Be able to execute functions before the query/mutation resolver.
    if (typ.policies) {
      typ.resolve = wrapResolver(typ);
    }

    Object.keys(typ._fields).forEach(fieldName => {
      const field = typ._fields[fieldName];

      if (field.policies) {
        // Be able to execute functions before the field resolver.
        typ._fields[fieldName] = wrapResolver(field);
      }
    });
  });
  return schema;
}

export { isAuthenticated, isAdmin, isOwner, isOwnerOrAdmin };
