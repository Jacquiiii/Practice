const axios = require("axios");
const { movieKey } = require('../keys/movie-key')

const getMovies = (text) => {

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

      if (identifier === 'movie') {
        console.log(identifier);
        return identifier;
      } else {
        console.log('this is not a movie');
      }

    })
    .catch((error) => console.error(error.message));

}

getMovies('watch harry potter');
