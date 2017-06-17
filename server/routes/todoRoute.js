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

//GET /todos handle
router.get('/todos',authenticate,(req, res) =>{
  Todo.find({_creator:req.user._id}).then((todos) =>{
     res.send({todos});
   },(err) =>{
     res.status(400).send(err);
   })

});
//Get /todos/id handle
router.get('/todos/:id',authenticate,(req,res) =>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({_id:id,_creator:req.user._id}).then((todo) =>{
    if(!todo){
      return  res.status(404).send()
    }
    res.send({todo})
  }).catch((e) =>{
    res.status(404).send();
  })

});

//POST /todos handle
router.post('/todos',authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator : req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    });

});

//DELETE /todo/:id
router.delete('/todos/:id',authenticate,(req,res) =>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo) =>{
    if(!todo){
      return  res.status(404).send()
    }
    res.send({todo})
  }).catch((e) =>{
    res.status(404).send();
  })

});

//PATCH todo/:id
router.patch('/todos/:id',authenticate,(req,res) =>{
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
//findOneAndUpdate
Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set : body},{new : true}).then((todo) =>{
  if(!todo){
    return res.status(404).send();
  }
  res.send({todo});
}).catch((e) =>{
   res.status(404).send();
})
});

//export the router
module.exports = router;
