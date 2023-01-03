// load .env data into process.env
require('dotenv').config();

// install axios in project: npm i axios
const axios = require("axios");

// API keys from .env files
const bookKey = process.env.BOOK_KEY;
const movieKey = process.env.MOVIE_KEY;


// Google Books API: https://developers.google.com/books/docs/v1/using
const getBooks = (text) => {

  return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${text}&key=${bookKey}`)
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => console.error(error.message));

};


// Movies Rapid-API: https://rapidapi.com/apidojo/api/online-movie-database/
const getMovies = (text) => {

  const options = {
    method: 'GET',
    url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
    params: {q: text},
    headers: {
      'X-RapidAPI-Key': movieKey,
      'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
    }
  };

  return axios.request(options)
    .then((response) => {
      const movieDetails = response.data.d;
      return movieDetails[0];
    })
    .catch((error) => console.log(error.message));

};


// Finds category based on predefined text. If no positive result is found, getCategory can be used to call APIs.
const categoryCheck1 = (text) => {
  text = text.toLowerCase();
  const arr = text.split(' ');
  if (arr.includes('buy')) return 'Products';
  if (arr.includes('watch')) return 'Movies';
  if (arr.includes('eat')) return 'Restaurants';
  if (arr.includes('read')) return 'Books';

  return false;
}


// Calls APIs until category is found
const categoryCheck2 = (text) => {

  return new Promise((resolve, reject) => {
    getMovies(text)
      .then(response => {
        if (response.qid === 'movie') {
          console.log('Movies');
          resolve('Movies');
        } else {
          getBooks(text)
          .then(response => {
            if (response.length > 0) {
              console.log('Books');
              resolve('Books');
            }
          })
          .catch((error) => reject(error.message));
        }
      })
      .catch((error) => reject(error.message));
  })

};


module.exports = { categoryCheck1, categoryCheck2 };

