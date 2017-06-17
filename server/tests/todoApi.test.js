// yarn downloaded modules
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');



//local user defined imports
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todosTestData,populateTodoData,usersTestData,populateUsersData} = require('./seed/seed');
const baseUrl = '/api/todo'

//Run before each test cast
beforeEach(populateTodoData);
beforeEach(populateUsersData);


describe('POST ${baseUrl}/todos', () => {
  it('should create a new todo', (done) => {
    var text = todosTestData[0].text;

    request(app)
      .post(`${baseUrl}/todos`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(2);
          expect(todosTestData[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post(`${baseUrl}/todos`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET ${baseUrl}/todos', () => {
  it('should get all todos for user1', (done) => {
    request(app)
      .get(`${baseUrl}/todos`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET ${baseUrl}/todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`${baseUrl}/todos/${todosTestData[0]._id.toHexString()}`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todosTestData[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`${baseUrl}/todos/${todosTestData[1]._id.toHexString()}`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`${baseUrl}/todos/123abc`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE ${baseUrl}/todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todosTestData[1]._id.toHexString();

    request(app)
      .delete(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should remove a todo', (done) => {
    var hexId = todosTestData[0]._id.toHexString();

    request(app)
      .delete(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete(`${baseUrl}/todos/123abc`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH ${baseUrl}/todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todosTestData[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should not update the todo created by other user', (done) => {
    var hexId = todosTestData[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todosTestData[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`${baseUrl}/todos/${hexId}`)
      .set('x-auth', usersTestData[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
