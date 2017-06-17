// yarn downloaded modules
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

//local user defined imports
var {authenticate} =require('./../middleware/authenticate');
var {
    mongoose
} = require('./../db/mongoose');
var {
    Todo
} = require('./../models/todo');
var {
    User
} = require('./../models/user');


router.post('/users',(req, res) =>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(() => {
      return user.generateAuthToken();
  }).then((token) =>{
    res.header('x-auth',token).send(user);
  }).catch((e) => {
      res.status(400).send(e);
  });
})


//hanlde /usrs/login post
router.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});
//handle /users/me/token DELETE
router.delete('/users/me/token',authenticate,(req,res) =>{
  req.user.removeToken(req.token).then(() =>{
    res.status(200).send();
  }).catch((e) =>{
    res.status(400).send();
  })
})
//handle if user has jwt
router.get('/users/me',authenticate,(req,res) =>{
    res.send(req.user);
});
//export the router
module.exports = router;
