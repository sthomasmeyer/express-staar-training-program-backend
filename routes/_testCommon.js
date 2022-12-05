const db = require('../db');

const User = require('../models/user');

async function beforeAllRouteTests() {
  if (process.env.NODE_ENV === 'test') {
    await db.query(`DELETE FROM users WHERE email='player_two@email.com'`);
    await db.query(`DELETE FROM users WHERE email='robben@bayern.org'`);
    await db.query(
      `DELETE FROM english_two_module_performance WHERE user_id=2`
    );
    await db.query(`DELETE FROM english_two_responses WHERE user_id=2`);

    await User.register({
      email: 'player_two@email.com',
      schoolId: 1,
      pwd: 'Password123',
      adminAccount: true
    });

    // Set the registered user's [id] to [2] --> this consistency is vital for testing.
    await db.query(`
      UPDATE users
      SET id=2
      WHERE email='player_two@email.com'
    `);
  } else if (process.env.NODE_ENV !== 'test') {
    console.log(
      `This system is currently operating in a [[ ${process.env.NODE_ENV} ]] environment.`
    );
  }
}

async function afterAllRouteTests() {
  if (process.env.NODE_ENV === 'test') {
    await db.query(`DELETE FROM users WHERE email='player_two@email.com'`);
    await db.query(`DELETE FROM users WHERE email='robben@bayern.org'`);
    await db.query(
      `DELETE FROM english_two_module_performance WHERE user_id=2`
    );
    await db.query(`DELETE FROM english_two_responses WHERE user_id=2`);

    await db.end();
  } else {
    console.log(
      `This system is currently operating in a [[ ${process.env.NODE_ENV} ]] environment.`
    );
  }
}

module.exports = {
  beforeAllRouteTests,
  afterAllRouteTests
};
