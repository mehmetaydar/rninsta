import { merge } from 'lodash/object'

export function entities(state = { messages: {} }, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }
  return state
}
