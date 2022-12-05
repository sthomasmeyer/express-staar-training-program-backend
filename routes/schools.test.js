'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

afterAll(() => db.end());

describe('GET /schools', () => {
  test('returns list of all schools', async () => {
    let res = await request(app).get('/schools');
    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /schools/:id', () => {
  test('[404] NOT FOUND error generated when appropriate', async () => {
    // There is not a school w/ ID No. 808 in the test-database.
    let res = await request(app).get('/schools/808');
    expect(res.statusCode).toEqual(404);
  });
  test('returns data about a specific school by [id]', async () => {
    // There is a school w/ ID No. 1 in the test-database.
    let res = await request(app).get('/schools/1');
    expect(res.statusCode).toEqual(200);
  });
});
