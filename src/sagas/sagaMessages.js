import { put, fork, select, take, call } from 'redux-saga/effects'
import { getMessages } from 'reducers/selectors'
import { apiMessages } from 'services'
import { messages, LOAD_MESSAGES } from 'actions'

function* fetchEntity(entity, apiFn, id) {
  yield put( entity.request(id) )
  const {response, error} = yield call(apiFn, id)
  if(response)
    yield put( entity.success(id, response) )
  else
    yield put( entity.failure(id, error) )
}

export const fetchMessages = fetchEntity.bind(null, messages, apiMessages.fetchMessages);

function* loadMessages(binId, requiredFields) {
  const messages = yield select(getMessages, binId)
  if (!messages || requiredFields.some(key => !messages.hasOwnProperty(key))) {
    yield call(fetchMessages, binId)
  }
}

export function* watchLoadMessages() {
  while(true) {
    const {binId, requiredFields = []} = yield take(LOAD_MESSAGES);
    yield fork(loadMessages, binId, requiredFields)
  }
}
