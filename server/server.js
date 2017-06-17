//environment set up
require('./config/config');
//user define environment variables
// yarn downloaded modules
const express = require('express');
const bodyParser = require('body-parser');
//local imports
var {authenticate} =require('./middleware/authenticate');
var todo = require('./routes/todoRoute');
var user = require('./routes/userRoute');

//initialize app
var app = express();
//Middleware
app.use(bodyParser.json());

//routes
app.use('/api/todo',todo);
app.use('/api/user',user);

//Home page handling
app.get('/', function(req, res) {
    res.send('hello world')
});
//start server
app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});
//export the app for testing 
module.exports = {
    app
};
