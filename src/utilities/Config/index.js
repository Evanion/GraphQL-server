import config from 'config';

export default class Config {
  static get(key) {
    const fileConfig = config.get(key);
    return process.env[fileConfig] || fileConfig;
  }
}