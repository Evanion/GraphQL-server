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
const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = String(Config.get('cors')).split(' ');
    if (whitelist.indexOf(origin) !== -1 || whitelist.indexOf('*') !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

app
  .use(cors(corsOptions))
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
