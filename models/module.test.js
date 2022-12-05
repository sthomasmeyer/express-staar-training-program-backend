'use strict';

const db = require('../db');
const Module = require('./module');

const { beforeAllModelTests, afterAllModelTests } = require('./_testCommon');

beforeAll(beforeAllModelTests);
afterAll(afterAllModelTests);

describe('Module-class method tests', () => {
  test('findAllBySubject', async () => {
    let modules = await Module.findAllBySubject('english_two');
    expect(modules.length).not.toEqual(0);
    expect(modules[0].id).toEqual(expect.any(Number));
    expect(modules[0].moduleName).toEqual(expect.any(String));
  });

  // Create mock performance data:
  const mockFirstAttempt = {
    firstAttempt: 0.5,
    bestOverall: 0.5,
    moduleId: 1,
    userId: 1
  };

  test('firstAttemptPerformance', async () => {
    let res = await Module.firstAttemptPerformance('english_two', {
      ...mockFirstAttempt
    });
    const mockData = await db.query(
      'SELECT * FROM english_two_module_performance WHERE module_id=1 AND user_id=1'
    );
    expect(mockData.rows.length).toEqual(1);
    expect(mockData.rows[0].id).toEqual(expect.any(Number));
    expect(+mockData.rows[0].first_attempt).toEqual(0.5);
    expect(+mockData.rows[0].best_overall).toEqual(0.5);
    expect(mockData.rows[0].module_id).toEqual(1);
    expect(mockData.rows[0].user_id).toEqual(1);
  });

  test('performanceUpdate', async () => {
    let performanceUpdate = await Module.performanceUpdate('english_two', {
      bestOverall: 0.75,
      moduleId: 1,
      userId: 1
    });
    const mockData = await db.query(
      'SELECT * FROM english_two_module_performance WHERE module_id=1 AND user_id=1'
    );
    expect(mockData.rows.length).toEqual(1);
    expect(+mockData.rows[0].first_attempt).toEqual(0.5);
    expect(+mockData.rows[0].best_overall).toEqual(0.75);
  });

  test('getPerformanceData', async () => {
    let mockData = await Module.getPerformanceData('english_two', 1, 1);
    expect(+mockData.firstAttempt).toEqual(0.5);
    expect(+mockData.bestOverall).toEqual(0.75);
  });
});
