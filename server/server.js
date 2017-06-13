
//environment set up
require('./config/config');

//user define environment variables

// yarn downloaded modules
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

//local user defined imports
var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');
var {authenticate} =require('./middleware/authenticate');






var app = express();

//Middleware
app.use(bodyParser.json());


//Start Request handling

//Home page handling
app.get('/', function(req, res) {
    res.send('hello world')
});

//GET /todos handle
app.get('/todos',(req, res) =>{
  Todo.find().then((todos) =>{
    res.send({todos});
  },(err) =>{
    res.status(400).send(err);
  })

});
//Get /todos/id handle
app.get('/todos/:id',(req,res) =>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({_id:id}).then((todo) =>{
    if(!todo){
      return  res.status(404).send()
    }
    res.send({todo})
  }).catch((e) =>{
    res.status(404).send();
  })

});

//POST /todos handle
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    });

});

//DELETE /todo/:id
app.delete('/todos/:id',(req,res) =>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) =>{
    if(!todo){
      return  res.status(404).send()
    }
    res.send({todo})
  }).catch((e) =>{
    res.status(404).send();
  })

});

//PATCH todo/:id
app.patch('/todos/:id',(req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  //check if completed set to true
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  //update
  Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((todo) =>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
     res.status(404).send();
  })
});
//////////////////  Below are handlders for USERS
// POST /Users
app.post('/users',(req, res) =>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(() => {
      return user.generateAuthToken();
  }).then((token) =>{
    res.header('x-auth',token).send(user);
  }).catch((e) => {
      res.status(400).send(e)
  });
})
//authentciate function

//test private route

app.get('/users/me',authenticate,(req,res) =>{
    res.send(req.user);
});

//start server
app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});

module.exports = {
    app
};
