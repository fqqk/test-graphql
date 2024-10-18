// appollo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers')

// create an express application
var app = express()

// create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// start the ApolloServer instance and then apply the middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // define a simple route
  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  // start the web server
  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
