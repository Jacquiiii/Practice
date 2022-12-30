const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
  params: {q: 'watch coraline'},
  headers: {
    'X-RapidAPI-Key': 'need to add a secret key',
    'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
  }
};

axios.request(options)
  .then((response) => {

    if (response.data.d.length > 0) {
      const movieDetails = response.data.d;
      const identifier = movieDetails[0].qid;
      return identifier;
    }

  })
  .catch((error) => console.error(error));
