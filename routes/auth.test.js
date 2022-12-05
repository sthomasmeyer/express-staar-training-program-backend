'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

const { beforeAllRouteTests, afterAllRouteTests } = require('./_testCommon');

beforeAll(beforeAllRouteTests);
afterAll(afterAllRouteTests);

describe('POST /auth/token', () => {
  test('log-in existing users', async () => {
    const res = await request(app).post('/auth/token').send({
      email: 'player_two@email.com',
      pwd: 'Password123'
    });
    expect(res.body).toEqual({
      user: {
        id: 2,
        email: 'player_two@email.com',
        schoolId: 1,
        adminAccount: true
      },
      token: expect.any(String)
    });
  });
});

describe('POST /auth/register', () => {
  test('register new users', async () => {
    // Create a test-user:
    const newAnonUser = {
      email: 'robben@bayern.org',
      schoolId: 2,
      pwd: 'Robben11'
    };

    const res = await request(app)
      .post('/auth/register')
      .send({
        ...newAnonUser
      });
    expect(res.body).toEqual({
      newUser: {
        id: expect.any(Number),
        email: 'robben@bayern.org',
        schoolId: 2,
        adminAccount: false
      },
      token: expect.any(String)
    });
  });
});
