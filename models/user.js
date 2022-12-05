'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config.js');

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} = require('../expressError');

class User {
  static async authenticate(email, password) {
    // Does this user exist?
    const res = await db.query(
      `SELECT 
        id, 
        email, 
        school_id AS "schoolId", 
        pwd, 
        admin_account AS "adminAccount" 
      FROM users 
      WHERE email = $1`,
      [email]
    );

    const user = res.rows[0];

    if (user) {
      // Does the user-provided password match the one in the database?
      const validPassword = await bcrypt.compare(password, user.pwd);
      if (validPassword === true) {
        delete user.pwd;
        return user;
      }
    }

    throw new UnauthorizedError('Invalid username/password');
  }

  static async register({ email, schoolId, pwd, adminAccount }) {
    const duplicateCheck = await db.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError('Registration attempt failed.');
    }

    const hashedPassword = await bcrypt.hash(pwd, BCRYPT_WORK_FACTOR);

    const res = await db.query(
      `INSERT INTO users (
        email,
        school_id,
        pwd,
        admin_account
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, school_id AS "schoolId", admin_account AS "adminAccount"`,
      [email, schoolId, hashedPassword, adminAccount]
    );

    const user = res.rows[0];

    return user;
  }

  static async findAll() {
    const res = await db.query(
      `SELECT 
          id,
          email,
          school_id AS "schoolId",
          admin_account AS "adminAccount"
        FROM users 
        ORDER BY school_id`
    );
    return res.rows;
  }

  static async getById(id) {
    const userRes = await db.query(
      `SELECT 
          id,
          email,
          school_id AS "schoolId",
          admin_account AS "adminAccount"
        FROM users 
        WHERE id = $1`,
      [id]
    );
    const user = userRes.rows[0];
    if (!user) {
      throw new NotFoundError(
        `There is no account associated w/ this [id]: ${id}`
      );
    }
    return user;
  }

  static async remove(email) {
    let res = await db.query(
      `DELETE 
        FROM users
        WHERE email = $1
        RETURNING email`,
      [email]
    );
    const user = res.rows[0];
    if (!user) {
      throw new NotFoundError(
        `There is no account associated w/ this email address: ${email}`
      );
    }
  }
}

module.exports = User;
