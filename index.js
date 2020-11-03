// index.js

/**
 * Required External Modules
 */

 const express = require('express');

 const path = require('path');


/**
 * App Variables
 */

 const app = express();
 const port = process.env.PORT || '8000';



/**
 *  App Configuration
 */
app.use(express.static(path.join(__dirname, "assets")));

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    res.render('index', {title: 'home'});
});

/**
 * Server Activation
 */

 app.listen(port, () => {
     console.log(`Listening to requests on http://localhost:${port}`);
 });