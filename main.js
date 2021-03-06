'use strict';

const apiKey = "5cqJ2B8JNfMpit5ZtJbjpLK3TLS091a6guEaAJCZ";
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(data) {
  // empty the results
  $('#results-list').empty();

  // loop through parks
  const parks = data.map(park => {
    park.addresses = park.addresses.filter(address => {
      return address.type === "Physical";
    })
    return park;
  });

  console.log(parks);

  for (let i = 0; i < data.length; i++) {
    $('#results-list').append(
      `<li>
        <h3 class="park-title">${data[i].fullName}</h3>
        <address>
          ${data[i].addresses[0].line1}
          <br>${data[i].addresses[0].city}, ${data[i].addresses[0].stateCode} ${data[i].addresses[0].postalCode}
        </address>
        <p>${data[i].description}</p>
        <a href="${data[i].url}" target="_blank">Learn More</a>
      </li>`
    );
  }
  $('.error-container').addClass('hidden');
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
      else {
        throw new Error(response.statusText);
      }
      
    })
    .then(responseJson => displayResults(responseJson.data))
    .catch(err => {
      $('.results-container').addClass('hidden');
        $('.error-container').removeClass('hidden');
        $('#js-error-message').empty();
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
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