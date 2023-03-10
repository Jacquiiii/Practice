require('dotenv').config(); // load .env data into process.env
const axios = require("axios"); // install axios in project: npm i axios
const language = require('@google-cloud/language'); // Imports the Google Cloud client library

// API keys from .env files:
const bookKey = process.env.BOOK_KEY;
const movieKey = process.env.MOVIE_KEY;


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


// Finds category based on predefined text. If no positive result is found, getCategory can be used to call APIs.
const categoryCheck1 = (text) => {
  text = text.toLowerCase();
  const arr = text.split(' ');
  if (arr.includes('buy')) return 'Buy';
  if (arr.includes('watch')) return 'Watch';
  if (arr.includes('eat')) return 'Eat';
  if (arr.includes('read')) return 'Read';

  return false;
}


// Calls APIs until category is found. If no category is found, returns null.
const categoryCheck2 = (text) => {

  return new Promise((resolve, reject) => {
    getMovies(text)
      .then(response => {
        if (response.qid === 'movie') resolve('Watch');
        return;
      })
      .catch((error) => reject(error.message));

    getBooks(text)
      .then(response => {
        if (response.length > 0) resolve('Read');
        return;
      })
      .catch((error) => reject(error.message));

    });

};


// ------------ Google natural language API function ------------ //


// Returns a promise. Requires npm install --save @google-cloud/language.
async function quickstart(text) {

  // Creates a client
  const client = new language.LanguageServiceClient();

  // Classifies text in the document
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const classificationModelOptions = { v2Model: { contentCategoriesVersion: 'V2'} };
  const [classification] = await client.classifyText({ document, classificationModelOptions });
  
  // Updated to true if the text matches a certain category
  let eat, watch, read, buy = false;

  // Loops through categories and updates variables to true if category is found
  for (category of classification.categories) {
    if (category.name.includes('Restaurants') || category.name.includes('Food Service') || category.name.includes('Cuisines')) {
      eat = true;
    }
    if (category.name.includes('Movie') || category.name.includes('TV')) {
      watch = true;
    }
    if (category.name.includes('Book')) {
      read = true;
    }
    if (category.name.includes('Shopping') || category.name.includes('Games') || category.name.includes('Home & Garden') || category.name.includes('Computers & Electronics') || category.name.includes('/Food/')) {
      buy = true;
    }
  }

  // Returns category matching the text
  if (eat) return 'Eat';
  if (watch) return 'Watch';
  if (read) return 'Read';
  if (buy) return 'Buy';

}

module.exports = { quickstart, categoryCheck1, categoryCheck2 };


// ------------------- Unsuccessful code ------------------ //


// Yelp API client for restaurants: https://github.com/tonybadguy/yelp-fusion

// const restaurantKey = process.env.RESTAURANT_KEY;
// const yelp = require('yelp-fusion');
// const client = yelp.client(restaurantKey);

// const getRestaurants = (text) => {

//   client.search({
//     term: text,
//     location: 'canada',
//   }).then(response => {
//     console.log(response.jsonBody.businesses);
//     console.log(response.jsonBody.businesses[0].name);
//   }).catch(e => {
//     console.log(e);
//   });

// };

// getRestaurants(text)
//   .then(response => {
//     if (response.businesses.length > 0) resolve('Restaurants');
//     return;
//   })
//   .catch((error) => reject(error.message));


// Rainforest Amazon categories API: https://www.rainforestapi.com/category-results-api

// const productKey = process.env.PRODUCT_KEY;

// const getProducts = (text) => {
//   const params = {
//     api_key: productKey,
//       amazon_domain: "amazon.ca",
//       asin: "B073JYC4XM",
//       type: "product"
//   };
//   axios.get('https://api.rainforestapi.com/request', { params })
//     .then(response => console.log(JSON.stringify(response.data, 0, 2)))
//     .catch(error => console.log(error))
// };



