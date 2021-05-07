var express = require('express');
var router = express.Router();

var login = require('./../../midend/logIn');
var permission = require('./../../midend/permissionCheck');
const userDataAccessor = require('./../../midend/userDataAccessor');
const user = new userDataAccessor();

var buttonPressed = false;

staffPermissions = [permission.possible_permissions[1],
                    permission.possible_permissions[2],
                    permission.possible_permissions[3]];

router.get('/', function (req, res) { //Url is 'localhost:8080/login/'

  // Why did I need to do this smh
  if (buttonPressed == false) {
    req.session.status = "";
  }
  else
    buttonPressed = false;
  // Too bad!

  if(staffPermissions.includes(req.session.userPermission)) {
    res.redirect('/staff');
  } else if (req.session.userPermission == "child") {
    res.redirect('/children');
  }
  else
    res.render('pages/login', {session: req.session});

})

router.post('/', function(req, res) {
  console.log(req.body);
  let loggedIn;

  try {
    loggedIn = login.isPasswordCorrect(req.body.username, req.body.password);
  } catch(e) {
    console.log('Something went oopsies');
  }
  if (loggedIn) {
    req.session.username = req.body.username.toLowerCase();

    userDetails = JSON.parse(user.getUser(req.body.username));

    req.session.userFName = userDetails.data.fName.charAt(0).toUpperCase() + userDetails.data.fName.slice(1);
    req.session.userLName = userDetails.data.lName.charAt(0).toUpperCase() + userDetails.data.lName.slice(1); //Sets user name in the session

    req.session.userPermission = permission.getUserPermission(req.session.username);

    if(staffPermissions.includes(req.session.userPermission)) {
      res.redirect('/staff');
    } else if (req.session.userPermission == "child") {
      res.redirect('/children');
    }

    req.session.status = "pass";

  } else {
    req.session.status = "fail";
    buttonPressed = true;

    console.log('Login Failure');
    res.redirect('/login');
  }
})

module.exports = router;
