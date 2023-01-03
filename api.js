// load .env data into process.env
require('dotenv').config();

// install axios in project: npm i axios
const axios = require("axios");

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// API keys from .env files
const bookKey = process.env.BOOK_KEY;
const movieKey = process.env.MOVIE_KEY;
const restaurantKey = process.env.RESTAURANT_KEY;

// Yelp code. Not working.
// const yelp = require('yelp-fusion');
// const client = yelp.client(restaurantKey);


// Google Books API: https://developers.google.com/books/docs/v1/using
const getBooks = (text) => {

  return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${text}&key=${bookKey}`)
    .then(response => response.data.items)
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
    .then(response => {
      const movieDetails = response.data.d;
      return movieDetails[0];
    })
    .catch((error) => console.log(error.message));

};


// Yelp API client for restaurants: https://github.com/tonybadguy/yelp-fusion
// not working
'use strict';
const getRestaurants = (text) => {

  client.search({
    term: text,
    location: 'canada',
  }).then(response => {
    console.log(response.jsonBody.businesses);
    console.log(response.jsonBody.businesses[0].name);
  }).catch(e => {
    console.log(e);
  });

};

getRestaurants('how to lose a guy in ten days');


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


// Calls APIs until category is found. If no category is found, returns null.
const categoryCheck2 = (text) => {

  return new Promise((resolve, reject) => {
    getMovies(text)
      .then(response => {
        if (response.qid === 'movie') resolve('Movies');
        return;
      })
      .catch((error) => reject(error.message));

    getBooks(text)
      .then(response => {
        if (response.length > 0) resolve('Books');
        return;
      })
      .catch((error) => reject(error.message));

    // not working:
    // getRestaurants(text)
    //   .then(response => {
    //     if (response.businesses.length > 0) resolve('Restaurants');
    //     return;
    //   })
    //   .catch((error) => reject(error.message));

    });

};


// ------------ Google natural language API function ------------ //


// Returns a promise. Requires npm install --save @google-cloud/language.
async function quickstart(text) {

  // Creates a client
  const client = new language.LanguageServiceClient();
  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  // V2 for Google Natural Language
  const classificationModelOptions = { v2Model: { contentCategoriesVersion: 'V2'} };
  // Classifies text in the document
  const [classification] = await client.classifyText({
    document,
    classificationModelOptions
  });
  // Updated to true if the text matches a certain category
  let restaurantWinner, movieWinner, bookWinner, productWinner = false;

  // Loops through categories and updates variables to true if category is found
  for (category of classification.categories) {
    if (category.name.includes('Restaurant')) restaurantWinner = true;
    if (category.name.includes('Movie')) movieWinner = true;
    if (category.name.includes('Book')) bookWinner = true;
    if (category.name.includes('Shopping') || category.name.includes('Games') || category.name.includes('Home & Garden') || category.name.includes('Computers & Electronics')) productWinner = true;
  }

  // Returns category matching the text
  if (restaurantWinner) return 'Restaurants';
  if (movieWinner) return 'Movies';
  if (bookWinner) return 'Books';
  if (productWinner) return 'Products';

}

module.exports = { quickstart, categoryCheck1, categoryCheck2 };
