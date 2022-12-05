'use strict';

const Text = require('./text');

const { afterAllModelTests } = require('./_testCommon');

afterAll(afterAllModelTests);

describe('Text-class method tests', () => {
  test('getTextBySubjectAndModuleId', async () => {
    let text = await Text.getTextBySubjectAndModuleId('english_two', 1);
    expect(text.length).not.toEqual(0);
    expect(text.id).toEqual(expect.any(Number));
    expect(text.title).toEqual(expect.any(String));
    expect(text.content).toEqual(expect.any(String));
    expect(text.moduleId).toEqual(expect.any(Number));
  });
});
