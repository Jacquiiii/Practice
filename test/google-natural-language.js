// -------------- Reads a file and determines category -------------- //

const fs = require('fs');

async function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function quickstart() {

  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  // Reads content of file passed in through command line
  const fileContent = await readFile(process.argv[2]);

  const [result] = await client.classifyText({
    document: {
      content: fileContent,
      type: 'PLAIN_TEXT',
    },
  });

  const categories = result.categories;
  console.log(categories[0].name);
}

quickstart();



// ------------ Determines sentiment of text passed into function ------------ //

async function quickstart(text) {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  // console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
}

quickstart('Hello, world!');


// -------- Determines category based on text passed into function -------- //

async function quickstart(text) {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const [result] = await client.classifyText({
    document: {
      content: text,
      type: 'PLAIN_TEXT',
    },
  });

  const categories = result.categories;
  console.log(categories[0].name);

}

quickstart("Harry Potter");

// quickstart("This study verified that the smoothness of reaching movements is able to quantitatively evaluate the effects of two-and three-dimensional images on movement in healthy people. In addition, clinical data of cerebrovascular accident patients were also analyzed by the same method.");
