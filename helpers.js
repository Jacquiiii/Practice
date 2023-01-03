// ------------ Google natural language API function ------------ //


// Returns a promise. Requires npm install --save @google-cloud/language.
async function quickstart(text) {

  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');
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

module.exports = { quickstart };


// add to server.js if required:

// const { quickstart } = require('./helpers.js');

// works with post route on public/scripts/app.js to insert form input into database and calls quickstart function to use google cloud natural language api to categorize
// app.post('/tasks', function(req, res) {

//   quickstart(req.body.name)
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
// });

