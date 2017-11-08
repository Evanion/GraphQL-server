/**
 * @name usernameTaken
 * @param username {String} The username to check
 * @param model {Object} the model that contains the usernames
 * @returns {Boolean}
 */
export default async function usernameTaken(username:String, model:Object){
  const user = await model.find({slug: username.toLowerCase()}, {id: 1});
  return Boolean(user.length)
}
