const request = require('supertest');
const expect = require('expect');
const { User, Role } = require('../../../db/models');
const app = require('../../../index');

describe('users', () => {
  let user = {
    firstName: 'jwt',
    lastName: 'test',
    email: 'jwt.test34@gmail.com',
    password: '123Qwerty',
    confirmPassword: '123Qwerty'
  };

  before(() => Role.bulkCreate([
    { name: 'admin' },
    { name: 'teacher' },
    { name: 'student' }
  ]));

  after(() => User.destroy({ truncate: true, cascade: true }));

  it('POST api/user', (done) => {
    request(app)
      .post('/api/user')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.token).toBeDefined();
        expect(res.body.email).toBe(user.email);
        done();
      });
  });

  it('POST api/user validation error', (done) => {
    request(app)
      .post('/api/user')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.token).toBeUndefined();
        expect(res.body.Error).toBe('SequelizeUniqueConstraintError: Validation error');
        done();
      });
  });

  it('POST api/user validation error when passwords don\'t match', (done) => {
    user = { ...user, password: 'new_password' };
    request(app)
      .post('/api/user')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.token).toBeUndefined();
        expect(res.body)
          .toEqual({ validationError: "password and confirm password don't match" });
        done();
      });
  });

  it('PUT api/user:id', (done) => {
    user = { ...user, email: 'updated@gmail.com' };
    request(app)
      .put('/api/user/1')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toEqual({ message: 'User updated successfully' });
        done();
      });
  });

  it('PUT api/user:id user not found', (done) => {
    user = { ...user, email: 'updated@gmail.com' };
    request(app)
      .put('/api/user/345')
      .send(user)
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toEqual({ Error: 'User: 345 does not exist' });
        done();
      });
  });

  it('DELETE api/user:id', (done) => {
    request(app)
      .delete('/api/user/1')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toEqual({ message: 'User deleted successfully' });
        done();
      });
  });

  it('DELETE api/user:id user not found', (done) => {
    request(app)
      .delete('/api/user/345')
      .send(user)
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toEqual({ Error: 'User: 345 does not exist' });
        done();
      });
  });
});