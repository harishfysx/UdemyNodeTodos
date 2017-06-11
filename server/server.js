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

//start server
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});

module.exports = {
    app
};