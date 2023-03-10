// Rapid API Movies: https://rapidapi.com/apidojo/api/online-movie-database/

const axios = require("axios");
const { movieKey } = require('../keys/movie-key');

const getMovies = (text) => {

  return new Promise((resolve, reject) => {

    const options = {
      method: 'GET',
      url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
      params: {q: text},
      headers: {
        'X-RapidAPI-Key': movieKey(),
        'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
      }
    };

    axios.request(options)
      .then((response) => {
        const movieDetails = response.data.d;
        const identifier = movieDetails[0].qid;
        (identifier === 'movie') ? resolve('Movies') : reject(new Error('This is not a movie'));
      })
      .catch((error) => reject(error));
  })

};

module.exports = { getMovies };


// ----------- add the following code to server.js if required ----------- //


// const { getMovies } = require('./test/rapid-api-movies.js');

// app.post('/tasks', function(req, res) {

//   getMovies(req.body.name)
//   .then((result) => {

//   const category = result;
//   const values = [req.body.name, category];
//   const queryString = `
//     INSERT INTO tasks (name, category)
//     VALUES ($1, $2)
//     RETURNING *;
//     `;

//   db.query(queryString, values)
//     .then(() => res.send('Success'))
//     .catch(() => res.send(err));

//   })
//   .catch(() => console.log('error'));

// });
