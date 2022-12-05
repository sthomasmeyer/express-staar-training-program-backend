'use strict';

const db = require('../db');

const { NotFoundError } = require('../expressError');

class Module {
  // The 'subject' parameter must be aligned to module-specific tables in the db...
  // For example, to access the data stored in the 'english_two_modules' table...
  // the given subject would have to be 'english_two'
  static async findAllBySubject(subject) {
    const res = await db.query(
      `SELECT
        id,
        module_name AS "moduleName"
      FROM ${subject}_modules
      ORDER BY id`
    );
    return res.rows;
  }

  static async findBySubjectPlusId(subject, id) {
    const res = await db.query(
      `SELECT
        id,
        module_name AS "moduleName"
      FROM ${subject}_modules
      WHERE id = $1`,
      [id]
    );
    const targetModule = res.rows;
    if (targetModule.length === 0) {
      throw new NotFoundError(`There is no module with the ID No. ${id}`);
    }
    return targetModule;
  }

  // Methods related to an individual user's module performance:

  static async firstAttemptPerformance(
    subject,
    { firstAttempt, bestOverall, moduleId, userId }
  ) {
    const res = await db.query(
      `INSERT INTO ${subject}_module_performance (
        first_attempt,
        best_overall,
        module_id,
        user_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING first_attempt AS "firstAttempt", best_overall AS "bestOverall", module_id AS "moduleId", user_id AS "userId"`,
      [firstAttempt, bestOverall, moduleId, userId]
    );

    const response = res.rows[0];

    return response;
  }

  static async getPerformanceData(subject, moduleId, userId) {
    const res = await db.query(
      `SELECT 
        first_attempt AS "firstAttempt",
        best_overall AS "bestOverall",
        module_id AS "moduleId",
        user_id AS "userId"
      FROM ${subject}_module_performance
      WHERE module_id = $1 AND user_id = $2`,
      [moduleId, userId]
    );
    return res.rows[0];
  }

  static async getAllPerformanceData(subject, userId) {
    const res = await db.query(
      `SELECT
        first_attempt AS "firstAttempt",
        best_overall AS "bestOverall",
        module_id AS "moduleId"
      FROM ${subject}_module_performance
      WHERE user_id = $1
      ORDER BY module_id`,
      [userId]
    );
    return res.rows;
  }

  static async performanceUpdate(subject, { bestOverall, moduleId, userId }) {
    const res = await db.query(
      `UPDATE ${subject}_module_performance
      SET best_overall = $1
      WHERE module_id = $2 AND user_id = $3
      RETURNING best_overall AS "bestOverall", module_id AS "moduleId", user_id AS "userId"`,
      [bestOverall, moduleId, userId]
    );

    const response = res.rows[0];

    return response;
  }
}

module.exports = Module;
