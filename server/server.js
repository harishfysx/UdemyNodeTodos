//environment set up
require('./config/config');
//user define environment variables
// yarn downloaded modules
const express = require('express');
const bodyParser = require('body-parser');

//local imports
const {authenticate} =require('./middleware/authenticate');
const todo = require('./routes/todoAPI');
const user = require('./routes/userAPI');


//initialize app
var app = express();

//Middleware
app.use(bodyParser.json());

//routes
app.use('/api/todo',todo);
app.use('/api/user',user);


//start server
app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});
//export the app for testing
module.exports = {
    app
};
