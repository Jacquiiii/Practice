// ------------------- Require code ------------------- //

// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');
const db = require('./db/connection');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const { quickstart } = require('./helpers.js');


// -------------------- Sass code -------------------- //

// const sassMiddleware = require('./lib/sass-middleware');
// app.use(
//   '/styles',
//   sassMiddleware({
//     source: __dirname + '/styles',
//     destination: __dirname + '/public/styles',
//     isSass: false, // false => scss, true => sass
//   })
// );


// ------------------- Route code -------------------- //

// displays tasks from database
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

// displays users from database
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// renders home page
app.get('/', (req, res) => {
  res.render('index');
});

// works with post route on public/scripts/app.js to insert form input into database and calls quickstart function to use google cloud natural language api to categorize
app.post('/tasks', function(req, res) {

  quickstart(req.body.name)
    .then((result) => {
      const category = result;
      const values = [req.body.name, category];
      const queryString = `
        INSERT INTO tasks (name, category)
        VALUES ($1, $2)
        RETURNING *;
        `;
      db.query(queryString, values)
        .then(() => res.send('Success'))
        .catch(() => res.send(err));
      })
    .catch(() => console.log('error'));
});

// alternative to the above without google natural language
// app.post('/tasks', function(req, res) {

//   const category = 'unknown';
//   const values = [req.body.name, category];
//   const queryString = `
//     INSERT INTO tasks (name, category)
//     VALUES ($1, $2)
//     RETURNING *;
//     `;

//   db.query(queryString, values)
//     .then(() => res.send('Success'))
//     .catch(() => res.send(err));

// });


// --------------- Server listen code --------------- //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
