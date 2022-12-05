'use strict';

const request = require('supertest');
const { createToken } = require('../helpers/tokens');

const app = require('../app');
const { beforeAllRouteTests, afterAllRouteTests } = require('./_testCommon');

beforeAll(beforeAllRouteTests);
afterAll(afterAllRouteTests);

describe('GET /users/:id', () => {
  test('request fails w/ [401] UNAUTHORIZED error if no JWT is provided', async () => {
    let res = await request(app).get('/users/2');
    expect(res.statusCode).toEqual(401);
  });
  test('find by [id]', async () => {
    // Create a valid JWT to send w/ the request.
    const adminToken = createToken({
      id: 2,
      email: 'player_two@email.com',
      adminAccount: true
    });

    let res = await request(app)
      .get('/users/2')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        id: 2,
        email: 'player_two@email.com',
        schoolId: 1,
        adminAccount: true
      }
    });
  });
});
