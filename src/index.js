//@flow
import express from 'express'
import config from 'config'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import {verifyToken} from 'middleware/Authorization'

// Init database
import './database'

import schema from './schema'

const endpointURL = config.get('graphql.endpoint');
const graphiql = config.get('graphql.graphiql');
const port = config.get('port');
const secret = config.get('authentication.secret');
const refreshSecret = config.get('authentication.refreshSecret');
const app = express();
app
  .use(cors(config.get('cors')))
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
