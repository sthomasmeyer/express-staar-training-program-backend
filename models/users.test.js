'use strict';

const db = require('../db');
const User = require('./user');

const { beforeAllModelTests, afterAllModelTests } = require('./_testCommon');

beforeAll(beforeAllModelTests);
afterAll(afterAllModelTests);

describe('User-class Method Test #1', () => {
  test('register', async () => {
    // Create a test-user:
    const newAnonUser = {
      email: 'neymar@psg.com',
      schoolId: 2,
      pwd: 'Neymar10',
      adminAccount: false
    };

    let newUser = await User.register({ ...newAnonUser });
    const found = await db.query(
      "SELECT * FROM users WHERE email='neymar@psg.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].school_id).toEqual(2);
    expect(found.rows[0].admin_account).toEqual(false);
  });
});

describe('User-class Method Test #2', () => {
  test('authenticate', async () => {
    let user = await User.authenticate('neymar@psg.com', 'Neymar10');
    expect(user).toEqual({
      id: expect.any(Number),
      email: 'neymar@psg.com',
      schoolId: 2,
      adminAccount: false
    });
  });
});
