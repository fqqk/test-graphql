// appollo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server')

// define the schema and resolvers for the GraphQL server
const typeDefs = `
  type Query {
    totalPhotos: Int!
  }

  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
`

var photos = []

const resolvers = {
  Query: {
    totalPhotos: () => photos.length
  },
  Mutation: {
    // parent is mutation object
    postPhoto(_parent, args) {
      photos.push(args)
      return true
    }
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
