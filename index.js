// appollo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server')

// define the schema and resolvers for the GraphQL server
const typeDefs = `
  type Query {
    totalPhotos: Int!
  }
`

const resolvers = {
  Query: {
    totalPhotos: () => 42
  }
}

// create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// start the web server
server
  .listen()
  .then(({ url }) => { console.log(`GraphQL Service running on ${url}`) })
