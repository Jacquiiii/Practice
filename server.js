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

const { categoryCheck1, categoryCheck2, quickstart } = require('./api.js');


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


app.post('/tasks', function(req, res) {

  // synchronous check without api checks if input includes certain words matching specific categories and adds to database if one matches
  const firstCheck = categoryCheck1(req.body.name);
  if (firstCheck) {
    const category = firstCheck;
    const values = [req.body.name, category];
    const queryString = `
      INSERT INTO tasks (name, category)
      VALUES ($1, $2)
      RETURNING *;
      `;

    db.query(queryString, values)
      .then(() => res.send('Success'))
      .catch(() => res.send(err));

  // asynch check calls category specific apis and checks input against response data to determine if it could fall into one of those categories
  } else {
    categoryCheck2(req.body.name)
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
    .catch((err) => console.log(err));
    }

});


// works with post route on public/scripts/app.js to insert form input into database after categorizing the data
// app.post('/tasks', function(req, res) {

    // synchronous check without api checks if input includes certain words matching specific categories and adds to database if one matches
//   const firstCheck = categoryCheck1(req.body.name);
//   if (firstCheck) {
//     const category = firstCheck;
//     const values = [req.body.name, category];
//     const queryString = `
//       INSERT INTO tasks (name, category)
//       VALUES ($1, $2)
//       RETURNING *;
//       `;

//     db.query(queryString, values)
//       .then(() => res.send('Success'))
//       .catch(() => res.send(err));

    // asynch check calls Google Natural Language API and checks input against response data to determine if it could fall into one of those categories
//   } else {
//     quickstart(req.body.name)
//     .then((result) => {
//       const category = result;
//       const values = [req.body.name, category];
//       const queryString = `
//         INSERT INTO tasks (name, category)
//         VALUES ($1, $2)
//         RETURNING *;
//         `;
//       db.query(queryString, values)
//         .then(() => res.send('Success'))
//         .catch(() => res.send(err));
//       })
//     .catch((err) => console.log(err));
//   }

// });


// alternative to the above without api to categorize
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
