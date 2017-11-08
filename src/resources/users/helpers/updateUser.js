// @flow
import Validate from '../../../utilities/Validate'
import validatePassword from './validatePassword'
import hashPassword from './hashPassword'
import checkUsername from './checkUsername'

export default async function updateUser(payload: Object, model: Object, authUser: Object) {
  try {
    const id = payload.id || authUser.id;

    // we don't need Id any more, so lets remove it
    delete payload.id;

    // find user
    const user = await model.findById(id);

    if(payload.email && (payload.email !== user.email)){
      if(!Validate(payload.email, 'user.email')) {
        throw {path: 'email', message: 'INVALID_EMAIL'}
      }
      if(!await validatePassword(payload.password, user.password)) {
        throw {path: 'password', message: 'INCORRECT_PASSWORD'}
      }
    }

    /* If the user wants to change their password,
     * they have to supply their old password
     */
    if(payload.newPassword && payload.password) {
      if(!Validate(payload.newPassword, 'user.password')){
        throw {path: 'newPassword', message: 'INVALID_NEW_PASSWORD'}
      }

      if(!Validate(payload.password, 'user.password')) {
        throw {path: 'password', message:'INVALID_PASSWORD'}
      }

      if(!await validatePassword(payload.password, user.password)) {
        throw {path: 'password', message: 'INCORRECT_PASSWORD'}
      }
      payload.password = await hashPassword(payload.newPassword)
    }

    /* If the user wants to change the username
     * we need to check that it is available
     * and finally update the slug
     */
    if(payload.username !== user.username) {
      if(
        !Validate(payload.username, 'user.username') ||
        checkUsername( payload.username, model)
      ){
        throw {path: 'username', message: 'INVALID_USERNAME'}
      }
      payload.slug = String(payload.username).toLowerCase()
    }

    const updatedUser = Object.assign(user, payload);
    const result = updatedUser.save();
    return {
      ok: true,
      user: result
    }

  } catch(err) {
    if(err.code) {
      return {
        ok: false,
        errors: [{path: 'update', message: 'UNABLE_TO_UPDATE_USER'}]
      }
    }
    return {
      ok: false,
      errors: [err]
    }
  }
}
