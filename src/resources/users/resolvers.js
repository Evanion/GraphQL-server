import util from 'util';
import {tryLogin, validatePassword} from '../../authentication'
import User from './model'
import {createUser, hashPassword} from './helpers'

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
  const user = await User.find({slug: args.username.toLowerCase()}, {id: 1})
  return Boolean(user.length)
}

async function updateUser(parent: Object, args: Object, context:Object) {
  try {
    const user = await User.findById(args.id)
    delete args.id
    if(args.username !== user.username) {
      args.slug = String(args.username).toLowerCase()
    };
    if(args.newPassword) {
      const valid = args.password && await validatePassword(args.password, user.password)
      if(!valid) {
        throw Error({path: 'password', message:'INVALID_PASSWORD'})
      }
      args.password = await hashPassword(args.newPassword)
    }
    const updatedUser = Object.assign(user, args);
    const result = updatedUser.save();
    return {
      ok: true,
      user: result
    }

  } catch(err) {
    return {
      ok: false,
      errors: [err]
    }
  }
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
