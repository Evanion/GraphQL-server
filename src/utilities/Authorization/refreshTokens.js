// @flow
import jwt from 'jsonwebtoken';
import { createTokens } from './index';

/**
 * @name refreshTokens
 * @description creates new tokens based on a valid refresh token
 * @param refreshToken  {String}  Refresh token string
 * @param model         {Object}  The user model
 * @param SECRET        {String}  Application secret string used to sign tokens
 * @param REFRESHSECRET {String}  Application secret string used to sign refreshTokens
 * @return {Promise.<*>}
 */
export default (async function refreshTokens(
  refreshToken: String,
  model: Object,
  SECRET: String,
  REFRESHSECRET: String
) {
  let id = null;
  try {
    const { user } = jwt.decode(refreshToken);
    id = user;
  } catch (error) {
    return {};
  }
  if (!id) {
    return {};
  }

  const dbUser = await model.findById(id);

  if (!dbUser) {
    return {};
  }

  try {
    jwt.verify(refreshToken, dbUser.password + REFRESHSECRET);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    dbUser,
    SECRET,
    dbUser.password + REFRESHSECRET
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: dbUser
  };
});
