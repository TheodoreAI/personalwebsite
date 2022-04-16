require('dotenv').config();
const {
    Pool
} = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    max: 20,
    _maxListeners: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // For local development comment this out; for production uncomment it
    // ssl: {
    //     rejectUnauthorized: false
    // }
});
console.log(pool);
module.exports = {
    pool
};