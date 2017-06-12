const {ObjectId} = require('mongodb');
var {
    mongoose
} = require('./../server/db/mongoose');
var {
    Todo
} = require('./../server/models/todo');

var id = '593d93575d117f7a7ce29df211'
if(!ObjectId.isValid(id)){
  console.log('Id not valid')
}
//
/*
Todo.find({_id: id}).then((todos) =>{
  console.log('todos',todos)
});


// Find One
Todo.findOne({_id: id}).then((todos) =>{
  console.log('todos',todos)
});
*/

/*
// Find By Id
Todo.findById(id).then((todos) =>{
  if(!todos){
    return console.log('Id not found')
  }
  console.log('todos',todos)
}).catch((e) =>{
  console.log(e)
})
*/
