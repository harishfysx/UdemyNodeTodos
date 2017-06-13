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
