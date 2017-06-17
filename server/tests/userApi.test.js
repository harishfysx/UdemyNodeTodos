// yarn downloaded modules
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');



//local user defined imports
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todosTestData,populateTodoData,usersTestData,populateUsersData} = require('./seed/seed');
const baseUrl = '/api/user'
//Run before each test cast
beforeEach(populateTodoData);
beforeEach(populateUsersData);


describe('GET ${baseUrl}/users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get(`${baseUrl}/users/me`)
      .set('x-auth', usersTestData[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(usersTestData[0]._id.toHexString());
        expect(res.body.email).toBe(usersTestData[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get(`${baseUrl}/users/me`)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST ${baseUrl}/users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post(`${baseUrl}/users`)
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post(`${baseUrl}/users`)
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post(`${baseUrl}/users`)
      .send({
        email: usersTestData[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST ${baseUrl}/users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post(`${baseUrl}/users/login`)
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
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post(`${baseUrl}/users/login`)
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
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE ${baseUrl}/users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete(`${baseUrl}/users/me/token`)
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
