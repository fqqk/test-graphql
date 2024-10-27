import Query from './Query.js'
import Mutation from './Mutation.js'
import Type from './Type.js'

const resolvers = {
  Query,
  Mutation,
  ...Type
}

export default resolvers;