/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url  The URL to issue the GET request.
 * @returns {Promise}   Resolves to the JSON-parsed response body.
 */
function fetchModel(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
}

export default fetchModel;
