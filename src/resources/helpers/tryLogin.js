// @flow
import { createTokens } from '../../utilities/Authorization';
import validatePassword from './validatePassword';
import { GraphQLError } from 'graphql';

/**
 * @name tryLogin
 * @description Attempts to authenticate the user
 * @param email     {String} The users email
 * @param password  {String} The users password
 * @param db        {Object} The database connection
 * @param secret    {String} The secret string used to sign tokens
 * @param secret2   {String} THe secret string used to sign refresh tokens
 * @return {Promise<Object>} returns a response object
 */
export default (async function tryLogin(
  email: String,
  password: String,
  db: Object,
  secret: String,
  secret2: String
) {
  const user = await db.findOne({ email });
  if (!user) {
    throw new GraphQLError('INVALID_LOGIN');
  }

  if (user.status !== 'active') {
    throw new GraphQLError(`USER_IS_${user.status.toUpperCase()}`);
  }

  const valid = await validatePassword(password, user.password);
  if (!valid) {
    throw new GraphQLError('INVALID_LOGIN');
  }

  const [token, refreshToken] = await createTokens(user, secret, secret2);

  return {
    token,
    refreshToken,
    user
  };
});
