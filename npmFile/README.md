# OpticQL

## Performance testing for GraphQL endpoints
This package accompanies the OpticQL Electron app which can be downloaded from https://github.com/oslabs-beta/OpticQL

#### Note on Express :
You must be running an Express (NodeJS) server for this package to work

#### Step 1: 
In your server.js file, require in 'optic-ql' :
```javascript
const { opticQL } = require("optic-ql");
```

#### Step 2: 
Pass your GraphQL schema typeDefs, resolvers and Express app instance in as arguments to 'opticQL' :
```javascript
opticQL(typeDefs, resolvers, app)
```

#### Step 3: 
Start your server on port 3000 (it must be port 3000 to interact properly with the Electron app)

#### Step 4: 
From Electron app, click 'Import Schema'. Your schema will be imported to Electron app. Now you are ready to run GraphQL queries. In addition, at port 3000/graphql you will have an Apollo GraphQL query interface set up (for further testing convenience if performance metrics not needed)

#### Note
As shown below, for Mutation types, each field must be followed by a ',' for the visualization to work for Mutation commands in Electron app.

#### Example set-up :
```javascript
const express = require('express');
const cors = require('cors')
const { opticQL } = require("optic-ql");
const db = require('./models/starwarsModel.js');
const app = express();
app.use(cors())
const PORT = 3000;

const typeDefs = `
type Query {
  people: [Person!]!
  person(_id: Int!): Person!
}
type Mutation {
  createPerson(
	gender: String,
	height: Int,
	mass: String,
	hair_color: String,
	skin_color: String,
	eye_color: String,
	name: String!,
	birth_year: String,
  ): Person!
}
`
const resolvers = {
	Query: {
		person: (parent, args) => {
			try {
				const query = 'SELECT * FROM people WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
	    }
    },
  }
}

opticQL(typeDefs, resolvers, app)
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:3000/graphql`));
```