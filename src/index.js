// @flow
import express from 'express'

import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import Config from './utilities/Config';
import {verifyToken} from './middleware/Authorization'

// Init database
import './database'

import schema from './schema'

const endpointURL = Config.get('graphql.endpoint');
const graphiql = Config.get('graphql.graphiql');
const port = Config.get('port');
const secret = Config.get('authentication.secret');
const refreshSecret = Config.get('authentication.refreshSecret');
const corsWhitelist = String(Config.get('cors.whitelist')).split(',');
const app = express();

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (corsWhitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
};

app
  .options('*', cors(corsOptionsDelegate))
  .use(cors(corsOptionsDelegate))
  .use((req, res, next)=> {
    res.removeHeader("X-Powered-By");
    next();
  })
  .use(verifyToken)
  .use(endpointURL, bodyParser.json(), graphqlExpress((req)=>({
    context: {
      user: req.user,
      secret,
      refreshSecret
    },
    schema
  })))
  .use(graphiql, graphiqlExpress({endpointURL}))
  .listen(port, () => {
    console.log('Server started');
    console.log('Listening to port', port);
  });
