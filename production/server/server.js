const path = require('path');
const express = require('express');
const app = express();

let PORT = 3001;

app.use(express.json())
app.use(express.urlencoded())

if (process.env.NODE_ENV === 'production') {
	// Statically serve everything in the build folder on the route '/build'
	// So now index.html can look at build/bundle.js and find it there
	app.use('/build', express.static(path.join(__dirname, '../build')));
	app.use(express.static('client'));

	// Serve index.html on the route '/'. 
	app.get('/', (req, res) => {
		return res.sendFile(path.join(__dirname, '../client/index.html'));
	});

}

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));