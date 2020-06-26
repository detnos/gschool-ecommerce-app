var app = require('../src/app')
var request = require('supertest')
var assert = require('assert')
var pg = require('pg')
var Pool = pg.Pool

// reset our db
pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
})
pool.query('TRUNCATE TABLE users RESTART IDENTITY')

// create users
// read users info
// update user
// delte user
// list all users info

describe('POST /user', function() {
    it('it should return status 200 when valid input passed', function(done) {
        request(app)
            .post('/user')
            .send({first_name: 'Bob', last_name: 'Burger', email: 'bob@bobsburgers.com'})
            .expect(200)
            .end(done)
    })
    it('it should return status 400 when invalid input passed', function(done) {
        request(app)
            .post('/user')
            .send({})
            .expect(400)
            .end(done)
    })
})

describe('GET /user/:id', function() {
    it('it should return status 200 when valid input passed', function(done) {
        request(app)
            .get('/user/1')
            .expect(200)
            .end(done)
    })
    it('it should return user with id passed', function(done) {
        request(app)
            .get('/user/1')
            .expect(function(res) {
                assert.deepStrictEqual(res.body, {
                    id: 1,
                    first_name: 'Bob', 
                    last_name: 'Burger',
                    name: 'Bob Burger',
                    email: 'bob@bobsburgers.com'
                })
            })
            .end(done)
    })
    it('it should return status 404 when invalid id passed', function(done) {
        request(app)
            .get('/user/-1')
            .expect(404)
            .end(done)
    })
})

describe('PATCH /user/:id', function() {
    it('it should return status 200 when valid input passed', function(done) {
        request(app)
            .patch('/user/1')
            .send({email: 'updated@bobsburgers.com'})
            .expect(200)
            .end(done)
    })
    it('it should return status 404 when invalid id passed', function(done) {
        request(app)
            .patch('/user/-1')
            .send({email: 'updated@bobsburgers.com'})
            .expect(404)
            .end(done)
    })
    it('it should return status 400 when invalid input passed', function(done) {
        request(app)
            .patch('/user/1')
            .send({})
            .expect(400)
            .end(done)
    })
    it('it should return an updated user with id passed', function(done) {
        request(app)
            .get('/user/1')
            .expect(function(res) {
                assert.deepStrictEqual(res.body, {
                    id: 1,
                    first_name: 'Bob', 
                    last_name: 'Burger',
                    name: 'Bob Burger',
                    email: 'updated@bobsburgers.com'
                })
            })
            .end(done)
    })
})

describe('DELETE /user/:id', function() {
    it('it should return status 200 when valid id passed', function(done) {
        request(app)
            .delete('/user/1')
            .expect(200)
            .end(done)
    })
    it('it should return status 404 when invalid input passed', function(done) {
        request(app)
            .delete('/user/-1')
            .expect(404)
            .end(done)
    })
    it('it should return status 404 on deleted ids', function(done) {
        request(app)
            .get('/user/1')
            .expect(404)
            .end(done)
    })
})

describe('GET /user', function() {
    it('it should return status 200 when valid input passed', function(done) {
        request(app)
            .get('/user')
            .expect(200)
            .end(done)
    })
    it('it should return list of users', function(done) {
        let agent = request(app)
        agent.post('/user')
        .send({first_name: 'Bob', last_name: 'Burger', email: 'bob@bobsburgers.com'})
        .expect(200)
        .then(function() {
            request(app).post('/user')
            .send({first_name: 'Bill', last_name: 'Thekid', email: 'bill@thekid.com'})
            .expect(200)
            .then(function() {
                request(app).get('/user')
                .expect(function(res) {
                    assert.deepStrictEqual(res.body, [
                        {
                            id: 2,
                            first_name: 'Bob', 
                            last_name: 'Burger', 
                            name: 'Bob Burger',
                            email: 'bob@bobsburgers.com'
                        },
                        {
                            id: 3,
                            first_name: 'Bill', 
                            last_name: 'Thekid', 
                            name: 'Bill Thekid',
                            email: 'bill@thekid.com'
                        }
                    ])
                })
                .end(done)
            })
        })
    })
})