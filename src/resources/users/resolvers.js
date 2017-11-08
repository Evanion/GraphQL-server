// @flow
import User from './model'
import tryLogin from './helpers/tryLogin'
import createUser from './helpers/createUser'
import updateUserFn from './helpers/updateUser'
import checkUsername from './helpers/checkUsername'



async function allUsers(parent: Object, args: Object, context: Object) {
  return User.find(args)
}

async function getUser(parent: Object, args: Object, context: Object) {
  return User.findById(args.id)
}

async function usernameTaken(parent: Object, args: Object, context: Object) {
  return checkUsername(args.username, User);
}

async function updateUser(parent: Object, args: Object, context: Object) {
  return updateUserFn(args, User)
}

async function register(parent: Object, args: Object, context: Object) {
  return createUser(args, User);
}

async function login(parent: Object, {email, password}, context: Object) {
  return tryLogin(
    email,
    password,
    User,
    context.secret,
    context.refreshSecret
  )
}

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
