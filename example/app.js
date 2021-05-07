const express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var moment = require('moment');

var session = require('express-session');
var crypto = require('crypto');
var uuid = require('node-uuid');

var childrenRoute = require('./routes/childrenRoute');
var staffRoute = require('./routes/staffRoute');
var loginRoute = require('./routes/loginRoute');
var logoutRoute = require('./routes/logoutRoute')

app.set('view engine', 'ejs'); //Use EJS rendering engine
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(session({
    secret: 'a454edxt6tgfv78uhbujij0okppl,okmi9ij8hygvtrfrdxdsdsrdf6tgy7yuhijiokmok,mppl,;.69696969696969696969420blazeladadada#teamwhomstdve\'',
    name: 'Cookie Goes Chomp',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 900000 //15 minute session length
    },
    genid:function(req){
      return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
    }
}));

//Index page
app.get("/", function(req, res) {
    res.redirect("/login");
});

//Routers for children and staff | yes I know not everyone is staff but for simplicities sake its going to be staff
app.use('/children', childrenRoute); //Used for any urls as 'localhost:8080/children/whateverRouteHere'
app.use('/staff', staffRoute); //Used for any urls as 'localhost:8080/staff/whateverRouteHere'
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);

//Start the server
app.listen(8080, () => {
    console.log("Listening on port 8080");
});
