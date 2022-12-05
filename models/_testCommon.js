const db = require('../db.js');

const User = require('../models/user');

async function beforeAllModelTests() {
  if (process.env.NODE_ENV === 'test') {
    await db.query(`DELETE FROM users WHERE email='player_one@email.com'`);
    await db.query(`DELETE FROM users WHERE email='neymar@psg.com'`);
    await db.query(
      `DELETE FROM english_two_module_performance WHERE user_id=1`
    );
    await db.query('DELETE FROM english_two_responses WHERE user_id=1');

    await User.register({
      email: 'player_one@email.com',
      schoolId: 1,
      pwd: 'Password123',
      adminAccount: true
    });

    // Set the registered user's [id] to [1] --> this consistency is vital for testing.
    await db.query(`
      UPDATE users
      SET id=1
      WHERE email='player_one@email.com'
    `);
  } else if (process.env.NODE_ENV !== 'test') {
    console.log(
      `This system is currently operating in a [[ ${process.env.NODE_ENV} ]] environment.`
    );
  }
}

async function afterAllModelTests() {
  if (process.env.NODE_ENV === 'test') {
    await db.query(`DELETE FROM users WHERE email='player_one@email.com'`);
    await db.query(`DELETE FROM users WHERE email='neymar@psg.com'`);
    await db.query(
      `DELETE FROM english_two_module_performance WHERE user_id=1`
    );
    await db.query('DELETE FROM english_two_responses WHERE user_id=1');

    await db.end();
  } else {
    console.log(
      `This system is currently operating in a [[ ${process.env.NODE_ENV} ]] environment.`
    );
  }
}

module.exports = {
  beforeAllModelTests,
  afterAllModelTests
};
