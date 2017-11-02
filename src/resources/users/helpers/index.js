import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function createUser(data: Object, model:Object)  {
  if(!data.hasOwnProperty('email') ||
     !data.hasOwnProperty('password') ||
     !data.hasOwnProperty('username')) {
    return {
      ok: false,
      errors: [{path: 'payload', message: 'INVALID_PAYLOAD'}]
    }
  }

  try {
    data.slug = data.username.toLowerCase();
    data.password = await hashPassword(data.password);

    const user =  await model.create(data);
    return {
      ok: true,
      user
    }
  } catch (error) {
    return {
      ok: false,
      errors: [{path: 'create', message: 'UNABLE_TO_CREATE_USER'}]
    }
  }
}

export async function hashPassword(password:string)  {
  return await bcrypt.hash(password, saltRounds);
}
