'use strict';

const Question = require('./question');

const { afterAllModelTests } = require('./_testCommon');

afterAll(afterAllModelTests);

describe('Question-class method tests', () => {
  test('getQuestionsByModule', async () => {
    let questions = await Question.getQuestionsByModule(1);
    expect(questions.length).not.toEqual(0);
    expect(questions[0].id).toEqual(expect.any(Number));
    expect(questions[0].questionType).toEqual(expect.any(String));
    expect(questions[0].correctAnswer).toEqual(expect.any(Array));
  });
});
