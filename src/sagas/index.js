import { fork, all } from 'redux-saga/effects'
import {watchLoadMessages} from './sagaMessages';
import {watchTryLocalSignin, watchClearErrorMessage, 
  watchSignup, watchSignin, watchSignout} from './sagaAuth';
import {watchReadref, watchSyncref} from './sagaFire';
import {watchLoadprofile, watchnbposts, watchnbfollowers, watchnbfollowing,
  watchLoadProfilePosts} from './sagaProfile';

export default function* rootSaga() {
  yield all([
    fork(watchLoadMessages),
    fork(watchTryLocalSignin),
    fork(watchClearErrorMessage),
    fork(watchSignup),
    fork(watchSignin),
    fork(watchSignout),
    fork(watchReadref),
    fork(watchSyncref),
    fork(watchLoadprofile),
    fork(watchnbposts),
    fork(watchnbfollowers),
    fork(watchnbfollowing),
    fork(watchLoadProfilePosts)
  ])
}