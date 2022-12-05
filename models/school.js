'use strict';

const db = require('../db');

const { NotFoundError } = require('../expressError');

class School {
  static async findAll() {
    const res = await db.query(
      `SELECT 
        id,
        city,
        county,
        district,
        school_name AS "schoolName"
      FROM schools
      ORDER BY id`
    );
    return res.rows;
  }

  static async getById(schoolId) {
    const res = await db.query(
      `SELECT 
        id,
        city,
        county,
        district,
        school_name AS "schoolName"
      FROM schools
      WHERE id = $1`,
      [schoolId]
    );
    const school = res.rows;
    if (school.length === 0) {
      throw new NotFoundError(
        `There are no schools associated with the ID No. ${schoolId}`
      );
    }
    return school;
  }
}

module.exports = School;
