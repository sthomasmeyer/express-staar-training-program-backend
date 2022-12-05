'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

const { beforeAllRouteTests, afterAllRouteTests } = require('./_testCommon');

beforeAll(beforeAllRouteTests);
afterAll(afterAllRouteTests);

describe('GET /modules/:subject', () => {
  test('returns a list of modules by subject', async () => {
    const res = await request(app).get('/modules/english_two');
    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /modules/:subject/:id', () => {
  test('[404] NOT FOUND error generated when appropriate', async () => {
    const res = await request(app).get('/modules/english_two/808');
    expect(res.statusCode).toEqual(404);
  });

  test('return a specific module by subject and [id]', async () => {
    const res = await request(app).get('/modules/english_two/1');
    expect(res.statusCode).toEqual(200);
  });
});

describe('POST (+) PATCH Requests', () => {
  test('capture first-attempt performance data', async () => {
    const mockFirstAttemptData = {
      firstAttempt: 0.25,
      bestOverall: 0.25,
      moduleId: 1,
      userId: 2
    };

    const res = await request(app)
      .post('/modules/english_two/first_attempt')
      .send({ ...mockFirstAttemptData });
    expect(res.statusCode).toEqual(201);

    const followUpQuery = await db.query(
      'SELECT * FROM english_two_module_performance WHERE user_id=2 AND module_id=1'
    );
    const performanceData = followUpQuery.rows[0];
    // The 'first_attempt' (+) 'best_overall' columns should have identical values.
    expect(+performanceData.first_attempt).toEqual(0.25);
    expect(+performanceData.best_overall).toEqual(0.25);
  });

  test('JSON-schema validator rejects invalid data w/ a [400] BAD REQUEST error', async () => {
    const badFirstAttemptData = {
      firstAttempt: 1,
      bestOverall: 1,
      moduleId: 1,
      userId: 'Mo Salah'
    };

    const res = await request(app)
      .post('/modules/english_two/first_attempt')
      .send({ ...badFirstAttemptData });
    expect(res.statusCode).toEqual(400);
  });

  test('update module performance', async () => {
    const performanceUpdate = {
      bestOverall: 1,
      moduleId: 1,
      userId: 2
    };

    const res = await request(app)
      .patch('/modules/english_two/update')
      .send({ ...performanceUpdate });
    expect(res.statusCode).toEqual(201);

    const followUpQuery = await db.query(
      'SELECT first_attempt AS "firstAttempt", best_overall AS "bestOverall" FROM english_two_module_performance WHERE user_id=2 AND module_id=1'
    );
    console.log(followUpQuery.rows[0]);
    const updatedPerformanceData = followUpQuery.rows[0];
    // The 'first_attempt' column should remain unchanged.
    expect(+updatedPerformanceData.firstAttempt).toEqual(0.25);
    // The 'best_overall' column should reflect the updated value.
    expect(+updatedPerformanceData.bestOverall).toEqual(1);
  });
});
