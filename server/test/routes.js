'use strict'

const request = require('supertest');
const expect = require('chai').expect;
const express = require('express');
const app = express();
const router = express.Router();
const routes = require('../routes/index.js');

describe('GET /users', function () {

    beforeEach(function () {
        app.use('/', routes);
    });

    it('respond with 200', function (done) {
        request(app)
            .get('/users')
            .expect(200, done);
    });

    it('respond with 404', function (done) {
        request(app)
            .get('/users/asdf')
            .expect(404, done);
    });
});

describe('POST /users', function () {

    beforeEach(function () {
        app.use('/', routes);
    });

    it('respond with 200', function (done) {
        const data = {
            first_name: 'dummy',
            last_name: 'test',
            city: 'Chihuahua',
            state: 'CUU'
          };
        request(app)
            .post('/users')
            .send(data)
            .expect(200, done);
    });

    it('respond with 500', function (done) {
        const data = {
            first_name: 'dummy',
            last_name: 'test',
            city: 'chihuahua',
            state: 'NL'
          };
        request(app)
            .post('/users')
            .send(data)
            .expect(500, done);
    });
});