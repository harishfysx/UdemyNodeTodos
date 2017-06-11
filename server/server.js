var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');
//Todo Model
var Todo = mongoose.model('Todos',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim : true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});
 //User Model
var User = mongoose.model('Users',{
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim : true
  }
});

//save User
var newUser = new User({
   email : '  harish@gmail.com '
})

newUser.save().then((doc) =>{
   console.log('Saved todo',JSON.stringify(doc,undefined,2));
}, (e) =>{
   console.log('Unable to save',e);
});
/*
var newTodo = new Todo({
  text: 'Cook Dinner',
});

var otherTodo = new Todo({
  text: 'Test',
//  completed :true,
  //completedAt : 123
});

otherTodo.save().then((doc) =>{
    console.log('Saved todo',JSON.stringify(doc,undefined,2));
},(e) => {
  console.log('Unable to save',e);
});
*/
