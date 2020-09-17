const { makeExecutableSchema } = require('apollo-server');
const { ApolloServer} = require('apollo-server-express');


exports.opticQL = function (typeDefs, resolvers, app) {
  
  app.use('/getSchema', (req, res) => {
    res.status(200).json({schemaNew: typeDefs})
  })

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const server = new ApolloServer({ schema, context: {}, tracing: true, });
  server.applyMiddleware({ app });  
}


