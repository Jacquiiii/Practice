const { yelpKey } = require('../keys/yelp-key');
const sdk = require('api')('@yelp-developers/v1.0#2hsur2ylbank95o');

const getRestaurants = (text) => {

  return new Promise((resolve, reject) => {

    sdk.auth(`Bearer ${yelpKey()}`);
    sdk.v3_business_search({location: 'canada', term: text, sort_by: 'best_match', limit: '20'})
      .then(({ data }) => {

        if (data.businesses.length === 0) {
          reject(new Error('This is not a restaurant'));
        }

        for (business of data.businesses) {
          console.log(business.name);
          resolve('Restaurants');
        }

      })
      .catch((error) => reject(error));
  });

};

module.exports = { getRestaurants };
