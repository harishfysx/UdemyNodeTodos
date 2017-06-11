// yarn downloaded modules
const expect = require('expect');
const request = require('supertest');
const {
    ObjectId
} = require('mongodb');

//local user defined imports
const {
    app
} = require('./../server');
var {
    Todo
} = require('./../models/todo');
var {
    User
} = require('./../models/user');


var todosTestData = [{
    _id: new ObjectId(),
    text: 'First todo'
}, {
    _id: new ObjectId(),
    text: 'Second todo'
}];
//Run before each test cast
beforeEach((done) => {
    //Remove the data
    Todo.remove({}).then(() => {
        //Add some test data
        return Todo.insertMany(todosTestData)
    }).then(() => {
        done();
    })

});

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
describe('Get /todos test cases', () => {

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
