// yarn downloaded modules
const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');



//local user defined imports
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todosTestData,populateTodoData,usersTestData,populateUsersData} = require('./seed/seed');

//Run before each test cast
beforeEach(populateTodoData);
beforeEach(populateUsersData);

// POST /todos tests
describe('POST /todos', () => {

it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({
                text
            }).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            })

        })

});

//test 2 - Before Each runs even before this test
it('should not create to do with invalid body data', (done) => {
    var text = 'Test todo text';
    request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            })
        })


      });

}); //Post describe end

//
//GET describe
describe('GET /todos test cases', () => {

    //test1
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    //test 2
    it('it shoud retrun todo doc', (done) => {
        request(app)
            .get(`/todos/${todosTestData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosTestData[0].text);
            })
            .end(done);
    });
    //test3
    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    })

    //test4
    it('should return 404 for non -obect ids', (done) => {
        var hexId = "123";
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    })

});// Get describe end

//Start DELETE TEST cases

describe('DELETE /todos/:id', () =>{

  //test1
  it('shoudl remove a todo',(done) =>{
    var hexId = todosTestData[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err,res) =>{
        if(err){
          return done(err);
        }
        //query db to make sure its removed
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist();
          done();
        }).catch((e) =>{
          done(e);
        })

      })
  });

});//END DELETE TEST cases

//Start PATCH Test cases
describe('PATCH /todos/:id', () =>{

//test1
  it('should update the todo', (done) =>{
    var hexId = todosTestData[0]._id.toHexString();
    var text = 'This is updated first todo';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed : true,
        text
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  })

  //test 2

  it('should clear the completeAt', (done) =>{
    var hexId = todosTestData[1]._id.toHexString();
    var text = 'This is updated second todo';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed : false,
        text
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  })

});//End PATCH Test cases

//Start USERS end points toHexString
describe('GET /users/me testing', () =>{
  //test1
  it('Return user if authenticated',(done) =>{
    request(app)
      .get('/users/me')
      .set('x-auth',usersTestData[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body._id).toBe(usersTestData[0]._id.toHexString());
        expect(res.body.email).toBe(usersTestData[0].email);
      })
      .end(done);

  });

  //test2
  it('Return 401 if not authenticated',(done) =>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) =>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});//End describe('GET /users/me testing)

// start describe post /users
describe('POST /users',() =>{

//test1
  it('should create user ',(done) =>{
    var email ='user3@example.com';
    var password = 'test123C'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) =>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) =>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) =>{
          done(e);
        })
      });

  })

  //test2
  it('should not create user for invalid user', (done) =>{
    var email = 'hari';
    var password = 'abc';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  })
  //test3
 it('should not create user with duplicate email',(done) =>{
   var email ='user1@example.com';
   var password = 'test123C';
   request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
 })


})// end describe post /users


//start user/login
describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: usersTestData[1].email,
        password: usersTestData[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(usersTestData[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: usersTestData[1].email,
        password: usersTestData[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(usersTestData[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
}); //end users/login
//start /users/me/tokens
describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(usersTestData[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
//end /users/me/token

//End USERS end points
