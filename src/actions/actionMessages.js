import {createRequestTypes, action, REQUEST, SUCCESS, FAILURE} from './actionUtil';

export const MESSAGES = createRequestTypes('MESSAGES')

export const LOAD_MESSAGES = 'LOAD_MESSAGES'

export const messages = {
  request: binId => action(MESSAGES[REQUEST], {binId, isLoading: true}),
  success: (binId, response) => action(MESSAGES[SUCCESS], {binId, response}),
  failure: (binId, error) => {
    return action(MESSAGES[FAILURE], {binId, error});
  }
}

export const loadMessages = (binId, requiredFields = []) => action(LOAD_MESSAGES, {binId, requiredFields})