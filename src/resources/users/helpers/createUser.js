import Validate from 'utilities/Validate'
import FormatErrors from 'utilities/FormatErrors'
import hashPassword from './hashPassword'

const userObject = {
  email: String,
  password: String,
  username: String
}

export default async function createUser(data: userObject, model:Object)  {
  try {
    if(!data.hasOwnProperty('email') ||
       !data.hasOwnProperty('password') ||
       !data.hasOwnProperty('username')) {
      throw {path: 'payload', message: 'INVALID_PAYLOAD'}
    }

    if(!Validate(data.email, 'user.email')) {
      throw {path: 'email', message: 'INVALID_EMAIL'}
    }

    if(!Validate(data.username, 'user.username')) {
      throw {path: 'username', message: 'INVALID_USERNAME'}
    }

    if(!Validate(data.password, 'user.password')) {
      throw {path: 'password', message: 'INVALID_PASSWORD'}
    }

    data.slug = data.username.toLowerCase();
    data.email = data.email.toLowerCase();
    data.password = await hashPassword(data.password);
    const user =  await model.create(data);
    return {
      ok: true,
      user
    }
  } catch(err) {
    if(err.errors || err.code) {
      let errors = FormatErrors(err)
      return {
        ok: false,
        errors
      }
    }
    return {
      ok: false,
      errors: [err]
    }
  }
}
