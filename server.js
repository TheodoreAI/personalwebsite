// server.js

/**
 * Required External Modules
 */

const express = require('express');
const path = require('path');
const {pool} = require("./dbconfig");
const flash = require('express-flash');
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");

const initializePassport = require("./passportConfig");
initializePassport(passport);
/**
 * App Variables
 */

 const app = express();
 const port = process.env.PORT || '8000';



/**
 *  App Configuration
 */
app.use(express.static(path.join(__dirname, "assets")));
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
/**
 * GET Routes Definitions
 */
app.get('/', (req, res) => {
    
    // logStatus = [];
    // if(req.isAuthenticated){
    //     logStatus.push("logout");
    //     res.render('index', {logStatus});
    // }else if (req.checkNotAuthenticated){
    //     logStatus.push("login");
    //     res.render('index', {logStatus});
    // }else{
    //     res.render('index');
    // }
    res.render('index');
    
});

app.get('/admin/register', checkAuthenticated, (req, res) =>{
    res.render("register");
})
app.get('/admin/login', checkAuthenticated, (req, res) =>{
    res.render("login");
});

app.get('/admin/dashboard', checkNotAuthenticated, (req, res) =>{
    res.render("dashboard", {user: req.user.name});
});

app.get("/admin/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "You have logged out successfully!");
    res.redirect('/admin/login');
});




/**
 * POST requests from the front-end to the backend and the database
 */

 app.post('/admin/register', async(req, res) =>{
     let {name, email, password, password2} = req.body;
     console.log({name, email});
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
        pool.query(`SELECT * FROM admin WHERE email = $1`, [email], (err, results)=>{
            if (err){
                throw err;
            }
            if (results.rows.length > 0){
                errors.push({message: "Email already registered!"});
                res.render('register', {errors});
            }else{
                pool.query(`INSERT INTO admin 
                (name, email, password)
                VALUES($1, $2, $3)
                RETURNING id, password`, [name, email, hashedPass], (err, results)=>{
                    if (err){
                        throw err;
                    }
                    req.flash("success_msg", "You are now registered. Please Log in");
                    res.redirect("/admin/login");
                })
            }
        })
    }
 });

app.post("/admin/login", passport.authenticate('local', 
{successRedirect: '/admin/dashboard', 
failureRedirect: '/admin/login',
failureFlash: true}),
);

app.post("/admin/about", (req, res)=>{
    let {title, name, descript} = req.body;

    //form validation errors list
    let errors = [];
    if (!title || !name || !descript){
        errors.push({message:"Please enter all fields"});
    }
    if(errors.length > 0){
        res.render('dashboard', {errors});
    }else{
  
        pool.query(`INSERT INTO about (title, name, descript)
        VALUES($1, $2, $3)`, [title, name, descript], (err, results)=>{
            if (err){
                throw err;
            }
            req.flash('success_msg', 'You have successfully added a new about section');
            res.render("dashboard", {success});
        })
    }
})



function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/admin/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/login');
}

/**
 * Server Activation
 */

 app.listen(port, () => {
     console.log(`Listening to requests on http://localhost:${port}`);
 });