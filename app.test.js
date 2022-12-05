const request = require('supertest');

const app = require('./app');
const db = require('./db');

test('[404] Not Found Error', async function () {
  const res = await request(app).get('/non_existent_route');
  expect(res.statusCode).toEqual(404);
});

afterAll(() => db.end());
