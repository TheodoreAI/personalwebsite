
/**
 * External Modules
 */
const express = require('express');
var router = express.Router();
const path = require('path');
const {pool} = require("./src/database/dbconfig");
const flash = require('express-flash');
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./src/database/passportConfig");
initializePassport(passport);

/**
 * App Variables
 */
 const app = express();
 const port = process.env.PORT || '3000';

/**
 *  App Configuration
 */
app.use(express.static(path.join(__dirname, "assets")));
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

/**
 * Middleware to allow the front end forms to send data to the server
 */
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Middleware for the routes
router.use(function timeLog (req, res, next) {
    next()
})

/* src Section */
var portfolio = require('./src/portfolio/portfolio');
var research = require('./src/research/research');
var services = require('./src/services/services');
var contact = require('./src/contact/contact');

/* Use Section */
app.use('/portfolio', portfolio);
app.use('/research', research);
app.use('/services', services);
app.use('/contact', contact);

/**
 * GET Routes Definitions
 */
app.get('/', (req, res) => {
    pool.query('SELECT * FROM about', (err, results)=>{
        if(err){
            throw err;
        }
        rows = results["rows"][0];
        rows.visits++;
        const loggedIn = req.isAuthenticated();
        pool.query(`UPDATE about 
                    SET
                        visits = $1
                    WHERE 
                        id = 1`, [rows.visits]);
                        const active = {home: 'active'};
        res.render("index", {rows, loggedIn, active});
    })
});

app.get('/register', checkAuthenticated, (req, res) =>{
    res.render("register");
})
app.get('/login', checkAuthenticated, (req, res) =>{
    const loggedIn = req.isAuthenticated();
    const active = {login: 'active'};
    res.render("login", {active, loggedIn});
});

app.get('/dashboard', checkNotAuthenticated, (req, res) =>{
    pool.query('SELECT * FROM about', (err, results)=>{
        if(err){
            throw err;
        }
        rows = results["rows"][0];
        res.render("dashboard", {rows});
    })
});




app.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "You have logged out successfully!");
    res.redirect('/login');
});

/**
 * POST requests from the front-end to the backend and the database
 */

 app.post('/register', async(req, res) =>{
     let {name, email, password, password2} = req.body;
    
    //  Form validation errors:
    let errors = [];
    if (!name || !email || !password || !password2){
        errors.push({message: "Please enter all fields"});
    }
    if (password.length < 6){
        errors.push({message: "Password should be at least 6 characters"});
    }
    if (password != password2){
        errors.push({message: "Passwords do not match"});
    }
    if (errors.length > 0){
        res.render('register', {errors});
    }else{
        // form validations were passed
        let hashedPass = await bcrypt.hash(password, 10);
        // I want to query to the db if the user already exists
        pool.query(`SELECT * FROM admins WHERE email = $1`, [email], (err, results)=>{
            if (err){
                throw err;
            }
            if (results.rows.length > 0){
                errors.push({message: "Email already registered!"});
                res.render('register', {errors});
            }else{
                pool.query(`INSERT INTO admins 
                (name, email, password)
                VALUES($1, $2, $3)
                RETURNING id, password`, [name, email, hashedPass], (err, results)=>{
                    if (err){
                        throw err;
                    }
                    req.flash("success_msg", "You are now registered. Please Log in");
                    res.redirect("/login");
                })
            }
        })
    }
 });

app.post("/login", passport.authenticate('local', 
{successRedirect: '/dashboard', 
failureRedirect: '/login',
failureFlash: true}),
);

// Add about info
app.post("/dashboard", (req, res)=>{
    let {name, descript} = req.body;
    //form validation errors list
    let errors = [];
    if (!name || !descript){
        errors.push({message:"Please enter all fields"});
    }
    if(errors.length > 0){
        res.render('dashboard', {errors});

    }else{
        pool.query(`INSERT INTO about (name, descript)
        VALUES($1, $2)`, [name, descript], (err, results)=>{
            if (err){
                throw err;
            }
            req.flash('success_msg', 'You have successfully added a new about section');
            res.render("dashboard");
        })
    }
})

// Update about info
app.post('/dashboard/update', (req, res)=>{
    let {id, name, visits, descript} = req.body;
    //form validation errors list
    console.log(name);
    let errors = [];
    if (!name || !descript || !visits){
        errors.push({message:"Please enter all fields"});
    }
    if(errors.length > 0){
        req.flash("errors", "Please enter all fields")
        res.redirect('/dashboard');

    }else{
        pool.query(
            `UPDATE 
                about 
            SET
                name = $2,
                visits = $3,
                descript = $4
            WHERE 
                id = $1`, [id, name, visits, descript], (err, results)=>{
            if (err){
                throw err;
            }
            req.flash('success_msg', 'You have successfully Updated About section');
            res.redirect("/dashboard");
        })
    }
})

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

/**
 * Server Activation
 */

 app.listen(port, () => {
     console.log(`Listening to requests on http://localhost:${port}`);
 });
 module.exports = router;