'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

afterAll(() => db.end());

describe('GET /questions/:moduleId', () => {
  test('returns questions associated w/ a given module [id]', async () => {
    // There are questions aligned to a module w/ ID No. 1 in the test-database.
    const res = await request(app).get('/questions/1');
    expect(res.statusCode).toEqual(200);
  });
  test('[404] NOT FOUND error generated when appropriate', async () => {
    const res = await request(app).get('/questions/808');
    expect(res.statusCode).toEqual(404);
  });
});
