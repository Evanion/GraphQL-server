// @flow
import bcrypt from 'bcrypt'
/**
 * @name validatePassword
 * @description Attempts to validate the password
 * @param password        {String} The users password
 * @param storedPassword  {String} The stored password we want to compare against
 * @return {Promise<Boolean>} returns a response object
 */
export default async function validatePassword (password: String, storedPassword: String) {
  return bcrypt.compare(password, storedPassword);
}
