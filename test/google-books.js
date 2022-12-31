// Google Books API: https://developers.google.com/books/docs/v1/using

const axios = require("axios");
const { bookKey } = require('../keys/book-key');
const key = bookKey();

const getBooks = (text) => {

  return new Promise((resolve, reject) => {

    const options = {
      method: 'GET',
      url: `https://www.googleapis.com/books/v1/volumes?q=${text}&key=${key}`,
    };

    axios.request(options)
      .then((response) => {
        const bookDetails = response.data.items;
        (bookDetails) ? resolve('Books') : reject(new Error('This is not a book'));
      })
      .catch((error) => reject(error));

  });

};

module.exports = { getBooks };


// ----------- add the following code to server.js if required ----------- //


// const { getBooks } = require('./test/google-books.js');

// app.post('/tasks', function(req, res) {

//   getBooks(req.body.name)
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
