//@flow
import util from 'util'
import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import db from './database'
import schema from './schema'

const endpointURL: String = config.get('graphql.endpoint'),
      graphiql: String = config.get('graphql.graphiql'),
      port: Number = config.get('port'),
      secret: String = config.get('authentication.secret'),
      refreshSecret: String = config.get('authentication.refreshSecret'),
      app: Object = express();
app
  .use(endpointURL, bodyParser.json(), graphqlExpress({
    context: {
      db,
      secret,
      refreshSecret
    },
    schema
  }))
  .use(graphiql, graphiqlExpress({endpointURL}))
  .listen(port, () => {
    console.log('Server started');
    console.log('Listening to port', port);
  });
