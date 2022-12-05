const jwt = require('jsonwebtoken');
const { createToken } = require('./tokens');
const { SECRET_KEY } = require('../config');

// Test the [createToken()] function that is designed to generate a JWT for users.
describe('createToken', function () {
  test('works for non-admin accounts', function () {
    const token = createToken({
      id: 3,
      email: 'player_three@email.com',
      adminAccount: false
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      id: 3,
      email: 'player_three@email.com',
      adminAccount: false
    });
  });

  test('works for admin accounts', function () {
    const token = createToken({
      id: 4,
      email: 'player_four@email.com',
      adminAccount: true
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      id: 4,
      email: 'player_four@email.com',
      adminAccount: true
    });
  });

  test('defaults to non-admin', function () {
    const token = createToken({
      id: 17,
      email: 'kdb@man_city.net'
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      id: 17,
      email: 'kdb@man_city.net',
      adminAccount: false
    });
  });
});
