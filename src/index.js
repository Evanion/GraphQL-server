// @flow
/* eslint no-console: 0 */
import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import Config from '@evanion/config-extended';
import { verifyToken } from './middleware/Authorization';

// Init database
import db from './database';
import { schema } from './resources';

const endpointURL = Config.get('graphql.endpoint');
const port = Config.get('port');
const secret = Config.get('authentication.secret');
const refreshSecret = Config.get('authentication.refreshSecret');
const corsWhitelist = String(Config.get('cors.whitelist')).split(',');
const app = express();

const corsOptionsDelegate = (req, callback) => {
  const origin = Boolean(
    corsWhitelist.indexOf(req.header('Origin')) !== -1 || corsWhitelist.indexOf('*') !== -1
  );
  const corsOptions = { origin };
  callback(null, corsOptions);
};

app
  .use(helmet())
  .options('*', cors(corsOptionsDelegate))
  .use(cors(corsOptionsDelegate))
  .use(
    endpointURL,
    bodyParser.json(),
    verifyToken,
    graphqlHTTP(async (req, response, params) => ({
      schema,
      graphiql: true,
      context: {
        db: db.models,
        user: req.user,
        secret,
        refreshSecret
      }
    }))
  );

app.listen(port, () => console.log('Server started on port %s', port));
