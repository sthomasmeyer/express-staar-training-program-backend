'use strict';

const db = require('../db');
const Response = require('./response');

const { beforeAllModelTests, afterAllModelTests } = require('./_testCommon');

beforeAll(beforeAllModelTests);
afterAll(afterAllModelTests);

describe('Response-class method tests', () => {
  // Create a test response:
  const testResponse = {
    correctResponse: ['the freedom of the outdoors', 'untamed patch of land'],
    userResponse: ['the freedom of the outdoors', 'incorrect response'],
    totalPoints: 2,
    pointsEarned: 1,
    questionId: 8,
    moduleId: 2,
    userId: 1
  };

  test('submit', async () => {
    let res = await Response.submit('english_two', { ...testResponse });
    const newRes = await db.query(
      'SELECT * FROM english_two_responses WHERE question_id=8'
    );
    expect(newRes.rows.length).toEqual(1);
    expect(newRes.rows[0].correct_response).toEqual(expect.any(Array));
    expect(newRes.rows[0].user_response).toEqual(expect.any(Array));
    expect(newRes.rows[0].total_points).toEqual(2);
    expect(newRes.rows[0].points_earned).toEqual(1);
  });
  test('findBySubjectUserAndModule', async () => {
    let res = await Response.findBySubjectUserAndModule('english_two', 1, 2);
    expect(res[0].correctResponse).toEqual(expect.any(Array));
    expect(res[0].userResponse).toEqual(expect.any(Array));
    expect(res[0].totalPoints).toEqual(2);
    expect(res[0].pointsEarned).toEqual(1);
  });
});
