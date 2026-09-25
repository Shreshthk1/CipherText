
const pg =  require( "pg");
const dotenv  = require("dotenv");
dotenv.config();

module.exports = {
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Render requires SSL
  })
};