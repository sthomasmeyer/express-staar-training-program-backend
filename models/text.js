'use strict';

const db = require('../db');

const { NotFoundError } = require('../expressError');

// Note --> consider renaming this class from 'Text' to 'Article' because in the...
// current version of the database all texts / articles are saved in subject-specific...
// tables that adhere to this naming template: [[ subject_articles ]]
class Text {
  static async findAll() {
    const res = await db.query(
      `SELECT
        id,
        title,
        author,
        genre,
        publication_date AS "publicationDate",
        content,
        context,
        module_id AS "moduleId"
      FROM english_two_articles
      ORDER BY module_id`
    );
    return res.rows;
  }

  // The 'subject' parameter must be aligned to article-specific tables in the db...
  // For example, to access the data stored in the 'english_two_articles' table...
  // the given subject would have to be 'english_two'
  static async findAllBySubject(subject) {
    const res = await db.query(
      `SELECT
        id,
        title,
        author,
        genre,
        publication_date AS "publicationDate",
        content,
        context,
        module_id AS "moduleId"
      FROM ${subject}_articles
      ORDER BY module_id`
    );
    return res.rows;
  }

  static async getTextBySubjectAndModuleId(subject, moduleId) {
    const res = await db.query(
      `SELECT 
        id,
        title,
        author,
        genre,
        publication_date AS "publicationDate",
        content,
        context,
        module_id AS "moduleId"
      FROM ${subject}_articles
      WHERE module_id = $1`,
      [moduleId]
    );
    const text = res.rows[0];
    if (!text) {
      throw new NotFoundError(
        `There is no text associated with Module No. ${moduleId}`
      );
    }
    return text;
  }
}

module.exports = Text;
