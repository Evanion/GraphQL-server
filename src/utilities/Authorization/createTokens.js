// @flow
import jwt from 'jsonwebtoken';
import Config from '@evanion/config-extended';

/**
 * @name createTokens
 * @description Generates the token and refresh JWT tokens
 * @param user    {Object} The user object
 * @param secret  {String} The secret string used to sign tokens
 * @param secret2 {String} The secret string used to sign refresh tokens
 * @return {Array} returns an array containing the token and refreshToken
 */
export default (async function createTokens(user: Object, secret: String, secret2: String) {
  const payload = {
    user: {
      id: user.id,
      roles: user.roles
    }
  };

  const tokenTTL = Config.get('authentication.tokenTTL');
  const refreshTTL = Config.get('authentication.refreshTTL');

  const createToken = jwt.sign(payload, secret, { expiresIn: tokenTTL });
  const refreshTokenSecret = user.password + secret2;
  const createRefreshToken = jwt.sign({ user: user.id }, refreshTokenSecret, {
    expiresIn: refreshTTL
  });
  return [createToken, createRefreshToken];
});
