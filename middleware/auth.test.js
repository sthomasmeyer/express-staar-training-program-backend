'use strict';

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin
} = require('./auth');

const goodJwt = jwt.sign(
  { id: 9, email: 'joebrrr@nfl.com', adminAccount: false },
  SECRET_KEY
);
const badJwt = jwt.sign(
  { id: 8, email: 'gerrard@liverpool.com', adminAccount: false },
  'invalidSecretKey'
);

describe('authenticateJWT', function () {
  test('works if the JWT is valid', function () {
    const req = { headers: { authorization: `Bearer ${goodJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        id: 9,
        email: 'joebrrr@nfl.com',
        adminAccount: false
      }
    });
  });
  test('fails if the JWT is invalid', function () {
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeTruthy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});

describe('ensureLoggedIn', function () {
  test('works if the active user is logged-in', function () {
    const req = {};
    const res = {
      locals: {
        user: {
          iat: 808,
          id: 23,
          emaiL: 'jordan@nba.com',
          adminAccount: false
        }
      }
    };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });
  test('fails if the active user is not logged-in', function () {
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe('ensureAdmin', function () {
  test('works if the user is an admin', function () {
    const req = {};
    const res = {
      locals: {
        user: {
          iat: 4444,
          id: 24,
          email: 'kobe@nba.org',
          adminAccount: true
        }
      }
    };
    const next = function (err) {
      expect(err).toBeFalsy;
    };
    ensureAdmin(req, res, next);
  });
  test('fails if the user is not an admin', function () {
    const req = {};
    const res = {
      locals: {
        user: {
          iat: 4444,
          id: 13,
          email: '1989@swift.com',
          adminAccount: false
        }
      }
    };
    const next = function (err) {
      expect(err).toBeTruthy;
    };
    ensureAdmin(req, res, next);
  });
});

describe('ensureCorrectUserOrAdmin', function () {
  test('works for all admin-accounts', function () {
    const req = { params: { id: 23 } };
    const res = { locals: { user: { id: 24, adminAccount: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
  test('works if the active user is the correct user', function () {
    const req = { params: { id: 23 } };
    const res = { locals: { user: { id: 23, adminAccount: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
  test('fails if the active user is not the correct user', function () {
    const req = { params: { id: 23 } };
    const res = { locals: { user: { id: 21, adminAccount: false } } };
    const next = function (err) {
      expect(err).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
  test('fails if the active user is anon', function () {
    const req = { params: { id: 23 } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
});
