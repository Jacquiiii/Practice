// -------- Determines category based on text passed into function -------- //


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

  const classificationModelOptions = {
    v2Model: {
      contentCategoriesVersion: 'V2',
    },
  };

  // Classifies text in the document
  const [classification] = await client.classifyText({
    document,
    classificationModelOptions,
  });

  // Updated to true if the text matches a certain category
  let restaurantWinner, movieWinner, bookWinner, productWinner = false;


  // Loops through categories and updayes variables to true if category is found
  for (category of classification.categories) {
    if (category.name.includes('Restaurant')) restaurantWinner = true;
    if (category.name.includes('Movie')) movieWinner = true;
    if (category.name.includes('Book')) bookWinner = true;
    if (category.name.includes('Shopping')) productWinner = true;
  }

  // Returns category matching the text
  if (restaurantWinner) return 'Restaurants';
  if (movieWinner) return 'Movies';
  if (bookWinner) return 'Books';
  if (productWinner) return 'Products';

}

console.log(quickstart('Coraline'));

module.exports = { quickstart };
