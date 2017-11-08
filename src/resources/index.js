// @flow

import {mergeTypes, mergeResolvers} from 'merge-graphql-schemas';

import users from './users';
import general from './general';

const resources = {general, users};

const schemasArray = [];
const resolversArray = [];
const modelsObject = {};

for(let key in resources) {
  if(!resources.hasOwnProperty(key)) continue;
  schemasArray.push(resources[key].typeDefs);
  resolversArray.push(resources[key].resolvers);
  if(resources[key].model) {
    modelsObject[resources[key].model.modelName] = resources[key].model
  }
}

export const typeDefs = mergeTypes(schemasArray);
export const resolvers = mergeResolvers(resolversArray);
export const models = modelsObject;
