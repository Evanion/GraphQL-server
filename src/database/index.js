import mongoose from 'mongoose'
import config from 'config'

const url:String = config.get('database.url')

mongoose.Promise = global.Promise;

const connection:Object = mongoose.connection.openUri(url);

export default connection;
