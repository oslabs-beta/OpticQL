const { Pool } = require("pg");

const PG_URI =
  "postgres://atwoecnd:xGnWyiAb8FiRpAjw2COZ7S6sbZpZYBBS@ruby.db.elephantsql.com:5432/atwoecnd";

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: async (text, params, callback) => {
    const res = await pool.query(text, params, callback);
    return res;
  },
};
