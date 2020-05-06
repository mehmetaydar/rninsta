import {entities} from './reducerMessages';
import {authReducer} from './reducerAuth';
import { combineReducers } from 'redux';

export function errorMessage(state = null, action) {
  const { type, error } = action
  if (type === 'RESET_ERROR_MESSAGE') {
    return null
  } else if (error) {
    return action.error
  }
  return state
}

export function isLoading(state = null, action) {
  if (action.type.endsWith("REQUEST")) {
    return true;
  }
  else if (action.type.endsWith("SUCCESS") || action.type.endsWith("ERROR")) {
    return false;
  }
  return false;
}


const rootReducer = combineReducers({
  entities,
  errorMessage,
  isLoading,
  authReducer
})

export default rootReducer;