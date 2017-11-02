//@flow
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import util from 'util'

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
export const tryLogin = async (email:String, password:String, db:Object, secret:String, secret2:String) => {
  const user = await db.findOne({email})
  if(!user) {
    return {
      ok: false,
      errors: [{path: 'login', message: 'INVALID_LOGIN'}]
    }
  }

  const valid = await validatePassword(password, user.password);
  if(!valid){
    return {
      ok: false,
      errors: [{path: 'login', message: 'INVALID_LOGIN'}]
    }
  }

  const [token, refreshToken] = await createTokens(user, secret, secret2);

  return {
    ok: true,
    token,
    refreshToken,
    user
  }

}

/**
 * @name validatePassword
 * @description Attempts to validate the password
 * @param password        {String} The users password
 * @param storedPassword  {String} The stored password we want to compare against
 * @return {Promise<Boolean>} returns a response object
 */
export const validatePassword = async (password:String, storedPassword:String) => {
  return await bcrypt.compare(password, storedPassword);
}

/**
 * @name createTokens
 * @description Generates the token and refresh JWT tokens
 * @param user    {Object} The users password
 * @param secret  {String} The secret string used to sign tokens
 * @param secret2 {String} THe secret string used to sign refresh tokens
 * @return {Array} returns an array containing the token and refreshToken
 */
async function createTokens(user, secret, secret2) {
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
