//user define environment variables
var port = process.env.PORT || 3000;
// yarn downloaded modules
var express = require('express');
var bodyParser = require('body-parser');

//local user defined imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//Middleware
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('hello world')
});

app.post('/todos',(req,res) =>{
//console.log(req.body);
var todo = new Todo({
  text : req.body.text
});
todo.save().then((doc) =>{
  res.send(doc)
}, (e) =>{
  res.status(400).send(e)
});

});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});
