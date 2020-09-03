const fetch = require('node-fetch');
const { makeExecutableSchema } = require('apollo-server');
const { ApolloServer} = require('apollo-server-express');


exports.opticQL = function (typeDefs, resolvers, app) {

  // SEND SCHEMA(typeDefs) TO ELECTRON
  function sendSchema () {
    fetch('http://localhost:3001/api/schema', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        typeDefs: typeDefs
      }),
    })
    .then((res) => {
      return res.json()
    })
    .then((data)=>{
      console.log('typeDefs has been sent. Response: ')
      console.log(data)
    })
  }
  sendSchema();


  // APP listen for schema req
  app.use('/getSchema', (req, res) => {
    sendSchema();
    res.status(200).json({schemaNew: typeDefs})
  })

  // CREATE APOLLO SERVER PLUS SCHEMA
  
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const server = new ApolloServer({ schema, context: {}, tracing: true, });
  server.applyMiddleware({ app });  


}


