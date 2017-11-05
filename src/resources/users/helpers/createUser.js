import Validate from 'utilities/validate'
import hashPassword from './hashPassword'
const userObject = {
  email: String,
  password: String,
  username: String
}

export default async function createUser(data: userObject, model:Object)  {
  if(!data.hasOwnProperty('email') ||
     !data.hasOwnProperty('password') ||
     !data.hasOwnProperty('username')) {
    return {
      ok: false,
      errors: [{path: 'payload', message: 'INVALID_PAYLOAD'}]
    }
  }

  if(!Validate(data.email, 'user.email')) {
    return {
      ok: false,
      errors: [{path: 'email', message: 'INVALID_EMAIL'}]
    }
  }

  if(!Validate(data.username, 'user.username')) {
    return {
      ok: false,
      errors: [{path: 'username', message: 'INVALID_USERNAME'}]
    }
  }

  if(!Validate(data.password, 'user.password')) {
    return {
      ok: false,
      errors: [{path: 'password', message: 'INVALID_PASSWORD'}]
    }
  }

  try {
    data.slug = data.username.toLowerCase();
    data.email = data.email.toLowerCase();
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
