/**
 * @name formatErrors
 * @description Reformats ORM errors to presentable errors for return to user
 * @param event {Object}  The error object from the ORM
 * @returns {Array} An array of formated errors
 */
export default function formatErrors (event:Object) {
  // If it's not a validation error, we throw an unknown error
  if(event.code) {
    return [{path: 'unknown', message: 'UNKNOWN_ERROR'}]
  }

  return Object.keys(event.errors).map((key) => {
    let value = event.errors[key];
    console.log(Object(value))

    return {path: key, message: `INVALID_${key.toUpperCase()}`}
  })
}
