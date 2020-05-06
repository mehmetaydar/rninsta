import { normalize } from 'normalizr'
import 'isomorphic-fetch'
import { responseMessageSchema } from 'schemas'

const API_ROOT = 'https://api.myjson.com/'

function callApi(endpoint, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({ json, response }))
    )
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return Object.assign({}, normalize(json, schema));
    })
    .then(
      response => ({response}),
      error => ({error: error.message || 'Something bad happened'})
    );
}

export const fetchMessages = binId => callApi(`bins/${binId}`, responseMessageSchema)