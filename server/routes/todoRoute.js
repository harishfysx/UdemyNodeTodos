

// yarn downloaded modules
const express = require('express');
const router = express.Router();
const todoRoute = router.route('/')
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

//local user defined imports
var {
    mongoose
} = require('./../db/mongoose');
var {
    Todo
} = require('./../models/todo');
var {
    User
} = require('./../models/user');



//var app = express();

//Middleware
//app.use(bodyParser.json());

//Start Request handling



//GET /todos handle
todoRoute.get('/todos',(req, res) =>{
  Todo.find().then((todos) =>{
    res.send({todos});
  },(err) =>{
    res.status(400).send(err);
  })

});
//Get /todos/id handle
todoRoute.get('/todos/:id',(req,res) =>{
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
todoRoute.post('/todos', (req, res) => {
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
todoRoute.delete('/todos/:id',(req,res) =>{
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
todoRoute.patch('/todos/:id',(req,res) =>{
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


module.exports = todoRoute;
