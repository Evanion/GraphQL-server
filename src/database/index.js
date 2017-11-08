// @flow
import mongoose from 'mongoose'
import Config from '../utilities/Config'

const url: String = Config.get('database.url');

mongoose.Promise = global.Promise;

const connection: Object = mongoose.connection.openUri(url);

export default connection;
