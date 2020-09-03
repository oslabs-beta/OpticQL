const path = require('path');
const express = require('express');
const app = express();

let PORT = 3001;

app.use(express.json())
app.use(express.urlencoded())

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'. 
  // PM: So now index.html can look at build/bundle.js and find it there!!!!!!!
  app.use('/build', express.static(path.join(__dirname, '../build')));

  // serve index.html on the route '/'. 
  // PM: We need to send index.html first, and then index html runs the script that loads the webpack data from build/bundle.js
  app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

app.use('/api/schema', (req, res) => {
  console.log(req.body.hello)
  // console.log(JSON.parse(req.body))
  console.log('schema received!!!')
  return res.status(200).json({hello: 'holaTest2'})
})

// For development mode ONLY --- to prevent error codes with application seeking 2nd instance of server file
app.use('/server/server.js', (req, res) => {
  return res.sendFile(path.join(__dirname, './server2.js'));
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));