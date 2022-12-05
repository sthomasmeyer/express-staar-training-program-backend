'use strict';

const db = require('../db');

class Response {
  // The 'subject' parameter passed to the [submit(subject, {})] method must...
  // be aligned to the module-specific tables in the database.
  static async submit(
    subject,
    {
      correctResponse,
      userResponse,
      totalPoints,
      pointsEarned,
      questionId,
      moduleId,
      userId
    }
  ) {
    const res = await db.query(
      `INSERT INTO ${subject}_responses (
        correct_response,
        user_response,
        total_points,
        points_earned,
        question_id,
        module_id,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING correct_response AS "correctResponse", user_response AS "userResponse", total_points AS "totalPoints", points_earned AS "pointsEarned", question_id AS "questionId", module_id AS "moduleId", user_id AS "userId"`,
      [
        correctResponse,
        userResponse,
        totalPoints,
        pointsEarned,
        questionId,
        moduleId,
        userId
      ]
    );

    const response = res.rows[0];

    return response;
  }

  static async clearOutdated(subject, questionId, userId) {
    const res = await db.query(
      `DELETE FROM ${subject}_responses WHERE question_id=$1 AND user_id=$2`,
      [questionId, userId]
    );

    return res.rows;
  }

  static async findBySubjectUserAndModule(subject, userId, moduleId) {
    const res = await db.query(
      `SELECT 
        correct_response AS "correctResponse",
        user_response AS "userResponse",
        total_points AS "totalPoints",
        points_earned AS "pointsEarned",
        question_id AS "questionId",
        module_id AS "moduleId",
        user_id AS "userId"
      FROM  ${subject}_responses
      WHERE user_id = $1 AND module_id = $2
      ORDER BY question_id`,
      [userId, moduleId]
    );

    const response = res.rows;

    return response;
  }
}

module.exports = Response;
