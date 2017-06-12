/*
const {SHA256} = require('crypto-js');
var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Mesage: ${message}`);
console.log(`hash : ${hash}`);

var data = {
  id:4
};

//we are sending datea
var token ={
  data,
  hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
}
//Middle hacker
token.data.id =5;
token.hash = SHA256(JSON.stringify(token.data)).toString()

//we are comparing data came back from user
var resultHash = SHA256(JSON.stringify(token.data) +'somesecret').toString();
if(resultHash == token.hash){
  console.log('Data was not changed');
}else{
  console.log('Data was changed');
}
*/
//Below is JWT playgorund
const jwt = require('jsonwebtoken');

var data = {
  id:10
}

var token = jwt.sign(data,'secret');
console.log(token);
