// @flow
import Validate from '../../../utilities/Validate';
import FormatErrors from '../../../utilities/FormatErrors';
import hashPassword from './hashPassword';

const userObject = {
  email: String,
  password: String,
  username: String
};

export default (async function createUser(data: userObject, model: Object) {
  const parsedUser = {};
  try {
    if (!data.email || !data.password || !data.username) {
      return FormatErrors({ path: 'payload', message: 'INVALID_PAYLOAD' });
    }

    if (!Validate(data.email, 'user.email')) {
      return FormatErrors({ path: 'email', message: 'INVALID_EMAIL' });
    }

    if (!Validate(data.username, 'user.username')) {
      return FormatErrors({ path: 'username', message: 'INVALID_USERNAME' });
    }

    if (!Validate(data.password, 'user.password')) {
      return FormatErrors({ path: 'password', message: 'INVALID_PASSWORD' });
    }

    parsedUser.username = data.username;
    parsedUser.slug = data.username.toLowerCase();
    parsedUser.email = data.email.toLowerCase();
    parsedUser.password = await hashPassword(data.password);
    const user = await model.create(parsedUser);
    return {
      ok: true,
      user
    };
  } catch (err) {
    if (err.errors || err.code) {
      const errors = FormatErrors(err);
      return {
        ok: false,
        errors
      };
    }
    return {
      ok: false,
      errors: [err]
    };
  }
});
