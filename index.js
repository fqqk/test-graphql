// appollo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers')

// start the ApolloServer instance and then apply the middleware
async function start() {
  const MONGO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true })
  const db = client.db()
  const context = { db }
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req}) => {
      const githubToken = req.headers.authorization
      const currentUser = await db.collection('users').findOne({ githubToken })
      return { db, currentUser }
    }
  })
  await server.start();
  // create an express application
  const app = express()
  server.applyMiddleware({ app });

  // define a simple route
  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  // start the web server
  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  );
}

start();
