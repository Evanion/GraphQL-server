// @flow
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function hashPassword(password: String)  {
  return bcrypt.hash(password, saltRounds);
}
