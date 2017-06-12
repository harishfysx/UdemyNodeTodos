const {ObjectId} = require('mongodb');
var {
    mongoose
} = require('./../server/db/mongoose');
var {
    Todo
} = require('./../server/models/todo');

/*
//Removes all the document
Todo.remove({}).then((result) =>{
  console.log(result);
})
*/

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove({_id : '593dd77c16551a046d0cd6d5'}).then((todo) =>{
  console.log(todo);
})
