// @flow
import { defaultFieldResolver } from 'graphql';

export default function wrapResolver(field) {
  const { resolve: oldResolver = defaultFieldResolver, policies } = field;

  const resolve = async function(root, args, context, info) {
    // Execute the array of functions (policies) in series.
    await policies.forEach(policy => policy(...arguments));

    return oldResolver(...arguments);
  };

  return { ...field, resolve, policies };
}
