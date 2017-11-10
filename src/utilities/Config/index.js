/* global process */
import config from 'config';

/**
 * @name Config
 * @description Handles configuration values
 * @copyright based on https://github.com/feathersjs/configuration released under MIT
 */
export default class Config {
  /**
   * @name Config.cfg
   * @description alias for node-config. Mainly for easier testing
   * @type {constructor}
   */
  static cfg = config;

  /**
   * @name Config.cfgDir
   * @static
   * @description path to the config directory
   * @type {String}
   */
  static cfgDir = config.util.getEnv('NODE_CONFIG_DIR');

  /**
   * @name Config.env
   * @static
   * @description contains the environment variables from process.env
   */
  static env = Object.assign({}, process.env);

  /**
   * @name Config.convert
   * @static
   * @description Converts the config to a easily read object
   * @param current
   * @return {Object}
   */
  static convert(current) {
    const result = Array.isArray(current) ? [] : {};

    Object.keys(current).forEach(name => {
      let value = current[name];

      if (typeof value === 'object' && value !== null) {
        value = this.convert(value);
      }

      if (typeof value === 'string') {
        if (value.indexOf('\\') === 0) {
          value = value.replace('\\', '');
        } else if (this.env[value]) {
          value = this.env[value]; // eslint-disable-line prefer-destructuring
        }
      }

      result[name] = value;
    });

    return result;
  }

  /**
   * @name Config.get
   * @description gets value from config module and checks if it might be an environment value
   * @static
   * @param key
   * @return {*}
   */
  static get(key) {
    return key.split('.').reduce((obj, index) => obj[index], this.convert(this.cfg));
  }
}
