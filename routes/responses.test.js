'use strict';

const request = require('supertest');

const db = require('../db');
const app = require('../app');

const { beforeAllRouteTests, afterAllRouteTests } = require('./_testCommon');

beforeAll(beforeAllRouteTests);
afterAll(afterAllRouteTests);

test('response submission', async () => {
  const mockResponseData = {
    correctResponse: ['dainty'],
    userResponse: ['dainty'],
    totalPoints: 1,
    pointsEarned: 1,
    questionId: 6,
    moduleId: 2,
    userId: 2
  };

  // Before conducting this test, double-check to ensure that the database has been setup properly.
  let databaseCheck = await db.query(
    `SELECT * FROM users WHERE email='player_two@email.com'`
  );

  // The [id] associated w/ the test 'player_two@email.com' account *should* be [2].
  if (+databaseCheck.rows[0].id === 2) {
    let res = await request(app)
      .post('/responses/english_two')
      .send({ ...mockResponseData });
    expect(res.statusCode).toEqual(201);

    let followUpQuery = await db.query(
      'SELECT * FROM english_two_responses WHERE question_id=6 AND user_id=2'
    );
    let responseData = followUpQuery.rows[0];
    expect(+responseData.total_points).toEqual(1);
    expect(+responseData.points_earned).toEqual(1);
    expect(responseData.user_response[0]).toEqual('dainty');
  }
});

test('JSON-schema validator rejects invalid data w/ a [400] BAD REQUEST error', async () => {
  const badResponseData = {
    correctResponse: ['grift'],
    userResponse: 'grift',
    totalPoints: 1,
    pointsEarned: 1,
    questionId: 808,
    moduleId: 808,
    userId: 808
  };

  let res = await request(app)
    .post('/responses/english_two')
    .send({ ...badResponseData });
  expect(res.statusCode).toEqual(400);
});

test('retrieve responses from the database', async () => {
  let res = await request(app).get('/responses/english_two/2/2');
  expect(res.statusCode).toEqual(200);
});
