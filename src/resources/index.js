// @flow
import { GraphQLSchema } from 'graphql';
import { policies } from '../utilities/Authorization';
import * as types from './types';
import * as models from './models';

const schema = policies(new GraphQLSchema(types));

export { models, schema };
