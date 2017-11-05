import util from 'util';
import User from './model'
import tryLogin from './helpers/tryLogin'
import validatePassword from './helpers/validatePassword'
import hashPassword from './helpers/hashPassword'
import createUser from './helpers/createUser'
import updateUserFn from './helpers/updateUser'
import checkUsername from './helpers/checkUsername'

export default {
  Query: {
    allUsers,
    getUser,
    usernameTaken
  },
  Mutation: {
    register,
    updateUser,
    login
  }
};

async function allUsers(parent: Object, args: Object, context: Object) {
  return await User.find(args)
}

async function getUser(parent: Object, args: Object, context:Object) {
  return await User.findById(args.id)
}

async function usernameTaken(parent: Object, args: Object, context) {
  return await checkUsername(args.username, User);
}

async function updateUser(parent: Object, args: Object, context:Object) {
  return updateUserFn(args, User)
}

async function register(parent: Object, args: Object, context:Object) {
  return await createUser(args, User);
}

async function login(parent: Object, {email, password}, context:Object) {
  return await tryLogin(
    email,
    password,
    User,
    context.secret,
    context.refreshSecret
  )
}
