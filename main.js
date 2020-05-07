'use strict';

const apiKey = "5cqJ2B8JNfMpit5ZtJbjpLK3TLS091a6guEaAJCZ";
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // empty the results
  console.log(responseJson);
  $('#results-list').empty();

  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
      `<li>
        <h3 class="park-title">${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}" target="_blank">Learn More</a>
      </li>`
    );
  };

  
    
  $('.results-container').removeClass('hidden');
};

function getNationalParks(state, maxResults=10) {
  const params = {
    stateCode: state,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      $('.results-container').addClass('hidden');
      $('.error-container').removeClass('hidden');
      $('#js-error-message').empty();
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-state').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(state, maxResults);
  });
}

$(watchForm);