const db = require('../connection');

// retreives all task data from the database
const getTasks = () => {
  return db.query('SELECT * FROM tasks;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getTasks };
