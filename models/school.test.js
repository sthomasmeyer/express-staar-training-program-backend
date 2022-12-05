'use strict';

const School = require('./school');

const { afterAllModelTests } = require('./_testCommon');

afterAll(afterAllModelTests);

describe(`School-class method tests`, () => {
  test('findAll', async () => {
    let allSchools = await School.findAll();
    expect(allSchools.length).not.toEqual(0);
    expect(allSchools[0].id).toEqual(expect.any(Number));
    expect(allSchools[0].city).toEqual(expect.any(String));
    expect(allSchools[0].county).toEqual(expect.any(String));
    expect(allSchools[0].district).toEqual(expect.any(String));
    expect(allSchools[0].schoolName).toEqual(expect.any(String));
  });
});
