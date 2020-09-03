const { Pool } = require('pg');

const PG_URI = 'postgres://muodauxm:9hsOBSDllk1LFlvfz-Ql2HgPfZiyC-uX@ruby.db.elephantsql.com:5432/muodauxm';

// create a new pool here using the connection string above
const pool = new Pool({
	connectionString: PG_URI,
});

module.exports = {
	query: (text, params, callback) => {
		console.log('executed query', text);
		return pool.query(text, params, callback);
	}
};