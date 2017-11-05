import bcrypt from 'bcrypt';
const saltRounds = 10;

export default async function hashPassword(password:string)  {
  return await bcrypt.hash(password, saltRounds);
}
