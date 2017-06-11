var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');

var Todo = mongoose.model('Todos',{
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'Cook Dinner',
});

var otherTodo = new Todo({
  text: 'Feed Cat',
  completed :true,
  completedAt : 123
});

otherTodo.save().then((doc) =>{
    console.log('Saved todo',JSON.stringify(doc,undefined,2));
},(e) => {
  console.log('Unable to save',e);
});
