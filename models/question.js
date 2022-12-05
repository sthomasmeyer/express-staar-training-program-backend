'use strict';

const db = require('../db');

const { NotFoundError } = require('../expressError');

class Question {
  static async findAll() {
    const res = await db.query(
      `SELECT
        id,
        aligned_standards AS "alignedStandards",
        question_type AS "questionType",
        question,
        answer_choices AS "answerChoices",
        correct_answer AS "correctAnswer",
        total_possible_points AS "totalPossiblePoints",
        selected_text AS "selectedText",
        incomplete_statement AS "incompleteStatement",
        directions,
        conditions,
        module_id AS "moduleId"
      FROM english_two_questions
      ORDER BY module_id`
    );
    return res.rows;
  }

  static async getQuestionsByModule(moduleId) {
    const res = await db.query(
      `SELECT 
        id,
        aligned_standards AS "alignedStandards",
        question_type AS "questionType",
        question,
        answer_choices AS "answerChoices",
        correct_answer AS "correctAnswer",
        total_possible_points AS "totalPossiblePoints",
        selected_text AS "selectedText",
        incomplete_statement AS "incompleteStatement",
        directions,
        conditions,
        module_id AS "moduleId"
      FROM english_two_questions
      WHERE module_id = $1
      ORDER BY id`,
      [moduleId]
    );
    const questions = res.rows;
    if (questions.length === 0) {
      throw new NotFoundError(
        `There are no questions associated with Module No. ${moduleId}`
      );
    }
    return questions;
  }
}

module.exports = Question;
