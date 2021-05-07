var express = require('express');
var router = express.Router();

var permission = require('./../../midend/permissionCheck');

staffPermissions = [permission.possible_permissions[1],
                    permission.possible_permissions[2],
                    permission.possible_permissions[3]];

router.get('/', function (req, res) { //Url is 'localhost:8080/login/'
  req.session.destroy();
  res.redirect('/login');
})

router.post('/', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
})

module.exports = router;
