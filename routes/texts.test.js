'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

afterAll(() => db.end());

describe('GET /texts/:moduleId', () => {
  test('[404] NOT FOUND error generated when appropriate', async () => {
    const res = await request(app).get('/texts/808');
    expect(res.statusCode).toEqual(404);
  });
  test('return a specific text by subject and module [id] number', async () => {
    const res = await request(app).get('/texts/english_two/1');
    expect(res.statusCode).toEqual(200);
  });
});
