const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const todosTestData = [{
    _id: new ObjectId(),
    text: 'First todo'
}, {
    _id: new ObjectId(),
    text: 'Second todo'
}];

const populateTodoData= (done) => {
    //Remove the data
    Todo.remove({}).then(() => {
        //Add some test data
        return Todo.insertMany(todosTestData)
    }).then(() => {
        done();
    })

};
//
userIdOne = new ObjectId();
userIdTwo = new ObjectId();

const usersTestData = [{
  _id: userIdOne,
  email : 'user1@example.com',
  password : 'userOnePassword',
  tokens : [{
    access : 'auth' ,
    token : jwt.sign({_id:userIdOne.toHexString(),access: 'auth'},'abc123').toString()
  }
 ]},
 {
   _id: userIdTwo,
   email : 'user2@example.com',
   password : 'userOnePassword',
  }
];

const populateUsersData= (done) => {
    //Remove the data
    User.remove({}).then(() => {
        //Add some test data
        var userOne = new User(usersTestData[0]).save();
        var userTwo = new User(usersTestData[1]).save();
        return Promise.all([userOne,userTwo])
    }).then(() => {
        done();
    })

};

module.exports ={todosTestData,populateTodoData,usersTestData,populateUsersData}
