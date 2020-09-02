const express = require('express');
const cors = require('cors')

// const { graphqlHTTP } = require('express-graphql');
// // const express_graphql = require('express-graphql');
// // const { buildSchema } = require('graphql');
// // const { GraphQLSchema, GraphQLObjectType, GraphQLString } = graphql
const db = require('./models/starwarsModel.js');

const { makeExecutableSchema } = require('apollo-server');

const axios = require('axios');



// app.get('/api', ((req, res) => {
// 	const test = `SELECT * FROM "people"`
// 	db.query(test).then((data) => {
// 		res.send(data)
// 	})
// }))

const { ApolloServer, gql } = require('apollo-server-express');
const app = express();
app.use(cors())

const PORT = 3000;


const typeDefs = `
type Query {
  people: [Person!]!
  person(id: Int!): Person!
  films: [Film!]!
  film(id: Int!): Film!
  planets: [Planet!]!
  planet(id: Int!): Planet!
  species: [Species!]!
  speciesByID(id: Int!): Species!
  vessels: [Vessel!]!
  vessel(id: Int!): Vessel!
  starshipSpecs: [StarshipSpec!]!
  starshipSpec(id: Int!): StarshipSpec!
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
  updatePerson(
	gender: String,
	height: Int,
	mass: String,
	hair_color: String,
	skin_color: String,
	eye_color: String,
	name: String!,
	birth_year: String,
  ): Person!
  deletePerson(id: ID!): Person!
  createFilm(
	director: String!,
	opening_crawl: String!,
	episode_id: Int!,
	_id: Int!,
	title: String!,
	release_date: String!,
	producer: String!,
  ): Film!
  updateFilm(
	director: String!,
	opening_crawl: String!,
	episode_id: Int!,
	_id: Int!,
	title: String!,
	release_date: String!,
	producer: String!,
  ): Film!
  deleteFilm(id: ID!): Film!
  createPlanet(
	orbital_period: Int,
	climate: String,
	gravity: String,
	terrain: String,
	surface_water: String,
	population: Int,
	_id: Int!,
	name: String,
	rotation_period: Int,
	diameter: Int,
  ): Planet!
  updatePlanet(
	orbital_period: Int,
	climate: String,
	gravity: String,
	terrain: String,
	surface_water: String,
	population: Int,
	_id: Int!,
	name: String,
	rotation_period: Int,
	diameter: Int,
  ): Planet!
  deletePlanet(id: ID!): Planet!
  createSpecies(
	hair_colors: String,
	name: String!,
	classification: String,
	average_height: String,
	average_lifespan: String,
	skin_colors: String,
	eye_colors: String,
	language: String,
  ): Species!
  updateSpecies(
	hair_colors: String,
	name: String!,
	classification: String,
	average_height: String,
	average_lifespan: String,
	skin_colors: String,
	eye_colors: String,
	language: String,
  ): Species!
  deleteSpecies(id: ID!): Species!
  createVessel(
	cost_in_credits: Int,
	length: String,
	vessel_type: String!,
	model: String,
	manufacturer: String,
	name: String!,
	vessel_class: String!,
	max_atmosphering_speed: String,
	crew: Int,
	passengers: Int,
	cargo_capacity: String,
	consumables: String,
	_id: Int!,
  ): Vessel!
  updateVessel(
	cost_in_credits: Int,
	length: String,
	vessel_type: String!,
	model: String,
	manufacturer: String,
	name: String!,
	vessel_class: String!,
	max_atmosphering_speed: String,
	crew: Int,
	passengers: Int,
	cargo_capacity: String,
	consumables: String,
	_id: Int!,
  ): Vessel!
  deleteVessel(id: ID!): Vessel!
  createStarshipSpec(
	MGLT: String,
	hyperdrive_rating: String,
  ): StarshipSpec!
  updateStarshipSpec(
	MGLT: String,
	hyperdrive_rating: String,
  ): StarshipSpec!
  deleteStarshipSpec(id: ID!): StarshipSpec!
}
type Person {
  _id: Int!
  gender: String
  height: Int
  mass: String
  hair_color: String
  skin_color: String
  eye_color: String
  name: String!
  birth_year: String
  vessels: [Vessel]
  films: [Film]
}
type Film {
  _id: Int!
  director: String!
  opening_crawl: String!
  episode_id: Int!
  title: String!
  release_date: String!
  producer: String!
  planets: [Planet]
  vessels: [Vessel]
  people: [Person]
  species: [Species]
}
type Planet {
  _id: Int!
  orbital_period: Int
  climate: String
  gravity: String
  terrain: String
  surface_water: String
  population: Int
  name: String
  rotation_period: Int
  diameter: Int
  films: [Film]
}
type Species {
  _id: Int!
  hair_colors: String
  name: String!
  classification: String
  average_height: String
  average_lifespan: String
  skin_colors: String
  eye_colors: String
  language: String
  people: [Person]
  planets: [Planet]
  films: [Film]
}
type Vessel {
  _id: Int!
  cost_in_credits: Int
  length: String
  vessel_type: String!
  model: String
  manufacturer: String
  name: String!
  vessel_class: String!
  max_atmosphering_speed: String
  crew: Int
  passengers: Int
  cargo_capacity: String
  consumables: String
  films: [Film]
  people: [Person]
  starshipSpecs: [StarshipSpec]
}
type StarshipSpec {
  _id: Int!
  MGLT: String
  hyperdrive_rating: String
}
`;

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
		people: () => {
			try {
				const query = 'SELECT * FROM people';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		film: (parent, args) => {
			try {
				const query = 'SELECT * FROM films WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
			}
		},
		films: () => {
			try {
				const query = 'SELECT * FROM films';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		planet: (parent, args) => {
			try {
				const query = 'SELECT * FROM planets WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
			}
		},
		planets: () => {
			try {
				const query = 'SELECT * FROM planets';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		speciesByID: (parent, args) => {
			try {
				const query = 'SELECT * FROM species WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
			}
		},
		species: () => {
			try {
				const query = 'SELECT * FROM species';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		vessel: (parent, args) => {
			try {
				const query = 'SELECT * FROM vessels WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
			}
		},
		vessels: () => {
			try {
				const query = 'SELECT * FROM vessels';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		starshipSpec: (parent, args) => {
			try {
				const query = 'SELECT * FROM starship_specs WHERE _id = $1';
				const values = [args._id];
				return db.query(query, values).then((res) => res.rows[0]);
			} catch (err) {
				throw new Error(err);
			}
		},
		starshipSpecs: () => {
			try {
				const query = 'SELECT * FROM starship_specs';
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
	},

	Mutation: {
		createPerson: (parent, args) => {
			const query = 'INSERT INTO people(gender, height, mass, hair_color, skin_color, eye_color, name, birth_year) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
			const values = [args.gender, args.height, args.mass, args.hair_color, args.skin_color, args.eye_color, args.name, args.birth_year];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updatePerson: (parent, args) => {
			try {
				const query = 'UPDATE people SET gender=$1 height=$2 mass=$3 hair_color=$4 skin_color=$5 eye_color=$6 name=$7 birth_year=$8  WHERE _id = $9';
				const values = [args.gender, args.height, args.mass, args.hair_color, args.skin_color, args.eye_color, args.name, args.birth_year, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deletePerson: (parent, args) => {
			try {
				const query = 'DELETE FROM people WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

		createFilm: (parent, args) => {
			const query = 'INSERT INTO films(director, opening_crawl, episode_id, title, release_date, producer, name, birth_year) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
			const values = [args.director, args.opening_crawl, args.episode_id, args.title, args.release_date, args.producer, args.name, args.birth_year];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updateFilm: (parent, args) => {
			try {
				const query = 'UPDATE films SET director=$1 opening_crawl=$2 episode_id=$3 title=$4 release_date=$5 producer=$6 name=$7 birth_year=$8  WHERE _id = $9';
				const values = [args.director, args.opening_crawl, args.episode_id, args.title, args.release_date, args.producer, args.name, args.birth_year, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deleteFilm: (parent, args) => {
			try {
				const query = 'DELETE FROM films WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

		createPlanet: (parent, args) => {
			const query = 'INSERT INTO planets(orbital_period, climate, gravity, terrain, surface_water, population, name, rotation_period, diameter) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
			const values = [args.orbital_period, args.climate, args.gravity, args.terrain, args.surface_water, args.population, args.name, args.rotation_period, args.diameter];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updatePlanet: (parent, args) => {
			try {
				const query = 'UPDATE planets SET orbital_period=$1 climate=$2 gravity=$3 terrain=$4 surface_water=$5 population=$6 name=$7 rotation_period=$8 diameter=$9  WHERE _id = $10';
				const values = [args.orbital_period, args.climate, args.gravity, args.terrain, args.surface_water, args.population, args.name, args.rotation_period, args.diameter, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deletePlanet: (parent, args) => {
			try {
				const query = 'DELETE FROM planets WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

		createSpecies: (parent, args) => {
			const query = 'INSERT INTO species(hair_colors, name, classification, average_height, average_lifespan, skin_colors, eye_colors, language, diameter) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
			const values = [args.hair_colors, args.name, args.classification, args.average_height, args.average_lifespan, args.skin_colors, args.eye_colors, args.language, args.diameter];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updateSpecies: (parent, args) => {
			try {
				const query = 'UPDATE species SET hair_colors=$1 name=$2 classification=$3 average_height=$4 average_lifespan=$5 skin_colors=$6 eye_colors=$7 language=$8 diameter=$9  WHERE _id = $10';
				const values = [args.hair_colors, args.name, args.classification, args.average_height, args.average_lifespan, args.skin_colors, args.eye_colors, args.language, args.diameter, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deleteSpecies: (parent, args) => {
			try {
				const query = 'DELETE FROM species WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

		createVessel: (parent, args) => {
			const query = 'INSERT INTO vessels(cost_in_credits, length, vessel_type, model, manufacturer, name, vessel_class, max_atmosphering_speed, crew, passengers, cargo_capacity, consumables) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
			const values = [args.cost_in_credits, args.length, args.vessel_type, args.model, args.manufacturer, args.name, args.vessel_class, args.max_atmosphering_speed, args.crew, args.passengers, args.cargo_capacity, args.consumables];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updateVessel: (parent, args) => {
			try {
				const query = 'UPDATE vessels SET cost_in_credits=$1 length=$2 vessel_type=$3 model=$4 manufacturer=$5 name=$6 vessel_class=$7 max_atmosphering_speed=$8 crew=$9 passengers=$10 cargo_capacity=$11 consumables=$12  WHERE _id = $13';
				const values = [args.cost_in_credits, args.length, args.vessel_type, args.model, args.manufacturer, args.name, args.vessel_class, args.max_atmosphering_speed, args.crew, args.passengers, args.cargo_capacity, args.consumables, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deleteVessel: (parent, args) => {
			try {
				const query = 'DELETE FROM vessels WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

		createStarshipSpec: (parent, args) => {
			const query = 'INSERT INTO starship_specs(MGLT, hyperdrive_rating, vessel_type, model, manufacturer, name, vessel_class, max_atmosphering_speed, crew, passengers, cargo_capacity, consumables) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
			const values = [args.MGLT, args.hyperdrive_rating, args.vessel_type, args.model, args.manufacturer, args.name, args.vessel_class, args.max_atmosphering_speed, args.crew, args.passengers, args.cargo_capacity, args.consumables];
			try {
				return db.query(query, values);
			} catch (err) {
				throw new Error(err);
			}
		},
		updateStarshipSpec: (parent, args) => {
			try {
				const query = 'UPDATE starship_specs SET MGLT=$1 hyperdrive_rating=$2 vessel_type=$3 model=$4 manufacturer=$5 name=$6 vessel_class=$7 max_atmosphering_speed=$8 crew=$9 passengers=$10 cargo_capacity=$11 consumables=$12  WHERE _id = $13';
				const values = [args.MGLT, args.hyperdrive_rating, args.vessel_type, args.model, args.manufacturer, args.name, args.vessel_class, args.max_atmosphering_speed, args.crew, args.passengers, args.cargo_capacity, args.consumables, args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},
		deleteStarshipSpec: (parent, args) => {
			try {
				const query = 'DELETE FROM starship_specs WHERE _id = $1';
				const values = [args._id];
				return db.query(query).then((res) => res.rows);
			} catch (err) {
				throw new Error(err);
			}
		},

	},

	Person: {
		vessels: (people) => {
			try {
				const query = 'SELECT * FROM vessels LEFT OUTER JOIN pilots ON vessels._id = pilots.vessel_id WHERE pilots.person_id = $1';
				const values = [people._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		films: (people) => {
			try {
				const query = 'SELECT * FROM films LEFT OUTER JOIN people_in_films ON films._id = people_in_films.film_id WHERE people_in_films.person_id = $1';
				const values = [people._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
	},

	Film: {
		planets: (films) => {
			try {
				const query = 'SELECT * FROM planets LEFT OUTER JOIN planets_in_films ON planets._id = planets_in_films.planet_id WHERE planets_in_films.film_id = $1';
				const values = [films._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		vessels: (films) => {
			try {
				const query = 'SELECT * FROM vessels LEFT OUTER JOIN vessels_in_films ON vessels._id = vessels_in_films.vessel_id WHERE vessels_in_films.film_id = $1';
				const values = [films._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		people: (films) => {
			try {
				const query = 'SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id WHERE people_in_films.film_id = $1';
				const values = [films._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		species: (films) => {
			try {
				const query = 'SELECT * FROM species LEFT OUTER JOIN species_in_films ON species._id = species_in_films.species_id WHERE species_in_films.film_id = $1';
				const values = [films._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
	},

	Planet: {
		films: (planets) => {
			try {
				const query = 'SELECT * FROM films LEFT OUTER JOIN planets_in_films ON films._id = planets_in_films.film_id WHERE planets_in_films.planet_id = $1';
				const values = [planets._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
	},

	Species: {
		people: (species) => {
			try {
				const query = 'SELECT * FROM people WHERE species_id = $1';
				const values = [_id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		planets: (species) => {
			try {
				const query = 'SELECT * FROM planets LEFT OUTER JOIN people ON planets._id = people.undefined WHERE people.species_id = $1';
				const values = [species._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		films: (species) => {
			try {
				const query = 'SELECT * FROM films LEFT OUTER JOIN species_in_films ON films._id = species_in_films.film_id WHERE species_in_films.species_id = $1';
				const values = [species._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
	},

	Vessel: {
		films: (vessels) => {
			try {
				const query = 'SELECT * FROM films LEFT OUTER JOIN vessels_in_films ON films._id = vessels_in_films.film_id WHERE vessels_in_films.vessel_id = $1';
				const values = [vessels._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		people: (vessels) => {
			try {
				const query = 'SELECT * FROM people LEFT OUTER JOIN pilots ON people._id = pilots.person_id WHERE pilots.vessel_id = $1';
				const values = [vessels._id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
		starshipSpecs: (vessels) => {
			try {
				const query = 'SELECT * FROM starship_specs WHERE vessel_id = $1';
				const values = [_id]
				return db.query(query, values).then((res) => res.rows);
			} catch (err) {
				throw new Error(err)
			}
		},
	},
}

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

// app.use('/graphql', graphqlHTTP({
// 	schema: schema,
// 	graphiql: true,
// }));

app.use('/api/hello', (req, res) => {
  res.status(200).json({hello: 'holaTest2'})
})




// app.listen(5000, () => console.log('Now browse to localhost:5000/graphql'));
const server = new ApolloServer({ schema, context: {}, tracing: true, });
server.applyMiddleware({ app });
app.listen({ port: PORT }, () =>
	console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
)
// axios.get('http://localhost:3000/graphql')
// 	.then(function (response) {
// 		console.log("response:", response);
// 	})
// 	.catch(function (err) {
// 		console.log("error:", err)
// 	});

// fetch("http://localhost:3000/graphql", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	// credentials: "include",
// })
// 	.then((response) => response.json())
// 	.then((data) => console.log("FETCH data", data))
// 	.catch((err) => console.log("ERROR in login fetch", err));

// fetch('http://localhost:3000/graphql')
// 	.then(resp => resp.json())
// 	.then(data => console.log(data));