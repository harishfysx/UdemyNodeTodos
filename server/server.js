//user define environment variables
var port = process.env.PORT || 3000;
// yarn downloaded modules
var express = require('express');
var bodyParser = require('body-parser');

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
const {ObjectId} = require('mongodb');

var app = express();

//Middleware
app.use(bodyParser.json());

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
//start server
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});

module.exports = {
    app
};
