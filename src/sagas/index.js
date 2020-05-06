import { fork, all } from 'redux-saga/effects'
import {watchLoadMessages} from './sagaMessages';
import {watchTryLocalSignin, watchClearErrorMessage, 
  watchSignup, watchSignin, watchSignout} from './sagaAuth';

export default function* rootSaga() {
  yield all([
    fork(watchLoadMessages),
    fork(watchTryLocalSignin),
    fork(watchClearErrorMessage),
    fork(watchSignup),
    fork(watchSignin),
    fork(watchSignout)
  ])
}