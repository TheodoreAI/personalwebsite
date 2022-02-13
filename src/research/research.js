
// Required imports to set the routes for the webpage.
var express = require('express');
var router = express.Router();
const path = require('path');
router.use(express.static(path.join(__dirname, "assets")));
const fs = require('fs');



/* GET request Section */ 
router.get('/', (req, res) =>{
    const loggedIn = false;
    const active = {research: 'active'};
    res.render("research", { loggedIn, active});
})

module.exports = router;