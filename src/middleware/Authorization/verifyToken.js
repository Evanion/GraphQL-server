import jwt from 'jsonwebtoken'
import Config from '../../utilities/Config'
import mongoose from 'mongoose'
import {refreshTokens} from '../../utilities/Authorization'

/**
 * @name verifyToken
 * @description Gets the token from the headers,
 *              and verifies the user.
 * @param req   {Object}    Express request object
 * @param res   {Object}    Express response object
 * @param next  {Function}  Express middleware done function
 */
export default async function verifyToken(req, res, next){
  const SECRET = Config.get('authentication.secret');
  const REFRESHSECRET = Config.get('authentication.refreshSecret');
  const rawToken = req.headers.authorization;
  let token;
  let keyword;

  if(rawToken) {
    try {
      [keyword, token] = rawToken.split(' ');
      const payload = jwt.verify(token, SECRET);
      req.user = payload.user
    } catch(error) {

      // if the first keyword isn't 'Bearer' we don't want to create new tokens
      if(keyword !== 'Bearer') {
        next();
        return
      }
      // if the tokens signature doesn't validate it's an fraudulent token
      if(error.name !== 'TokenExpiredError') {
        next();
        return
      }
      // else we try and refresh the token
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(refreshToken, mongoose.models.User, SECRET, REFRESHSECRET);
      if(newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'Authorization, x-refresh-token');
        res.set('Authorization', `Bearer ${newTokens.token}`);
        res.set('x-refresh-token', `${newTokens.refreshToken}`);
      }
      req.user = newTokens.user;
    }
  }
  next()
}
