import jwt from 'jsonwebtoken'

/**
 * @name createTokens
 * @description Generates the token and refresh JWT tokens
 * @param user    {Object} The user object
 * @param secret  {String} The secret string used to sign tokens
 * @param secret2 {String} THe secret string used to sign refresh tokens
 * @return {Array} returns an array containing the token and refreshToken
 */
export default async function createTokens(user:Object, secret:String, secret2:String) {
  let payload = {
    user: user.id,
    roles: user.roles
  };

  const createToken = jwt.sign(payload,secret, {expiresIn: '3h'});
  const refreshTokenSecret = user.password + secret2;
  const createRefreshToken = jwt.sign(
    {user: user.id},
    refreshTokenSecret,
    {expiresIn: '6h'}
  );
  return [createToken, createRefreshToken];
}
