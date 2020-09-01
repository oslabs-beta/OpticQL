const path = require('path');
const express = require('express');
const app = express();


const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded())

if (process.env.NODE_ENV === 'production') {

  // statically serve everything in the build folder on the route '/build'. 
  // PM: So now index.html can look at build/bundle.js and find it there!!!!!!!
  app.use('/build', express.static(path.join(__dirname, '../build')));

  // serve index.html on the route '/'. 
  // PM: We need to send index.html first, and then index html runs the script that loads the webpack data from build/bundle.js
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

}

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));