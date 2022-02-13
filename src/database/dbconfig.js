require('dotenv').config();
const {Pool} = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    // For local development comment this out; for production uncomment it
    // ssl:{
    //     rejectUnauthorized: false
    // } 
});

module.exports = {pool};