import patterns from './patterns';
/**
 * @method Validate
 * @description Validates that values
 * @param value {Sring} Value to be tested
 * @param pattern {String} A dot separated
 * @returns {Boolean} Returns true if the value matches
 */
export default function Validate(value:String, pattern:String) {
    let patternRegExp: RegExp = pattern.split('.').reduce((o,i)=>o[i], patterns);
    let validate = new RegExp(patternRegExp)
    return validate.test(value)
}
