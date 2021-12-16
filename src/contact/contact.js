var express = require('express');
var router = express.Router();
const path = require('path');
router.use(express.static(path.join(__dirname, "assets")));

/* GET request Section */ 
router.get('/', (req, res) =>{
    const loggedIn = false;
    const active = {contact: 'active'};
    res.render("contact", { loggedIn, active});
})

module.exports = router;