import { put, fork, select, take, call, takeLatest} from 'redux-saga/effects';
import {navigate} from '../navigationRef';
import { LOCAL_SIGNIN, CLEAR_ERROR_MESSAGE, SIGNUP, SIGNIN, SIGNOUT, 
    SIGNED_UP,SIGNED_IN,SIGNED_OUT, ADD_ERROR} from '../actions';
import Fire from '../database/Fire';

export function* watchTryLocalSignin() {

    yield take(LOCAL_SIGNIN, null);
    //const user = yield call(firebaseAuth);
    params = {};
    const user = yield call(Fire.shared.authStateChanged, params );
    if(user){
        //console.log(`FIREBASE-USER: ${user.uid}`);
        yield put({type: SIGNED_IN});
        navigate('Main');        
    }
    else{
        navigate("Signup");
    }
}

export function* watchClearErrorMessage(){
    //console.log("called clearErrorMessage");
    yield take(CLEAR_ERROR_MESSAGE);
    yield put({type: ADD_ERROR, payload: ''});
}

function* signup({email, password}){
    /*const getErrorMessage = (state) => state;
    const err = yield select(getErrorMessage);
    console.log(`State errorMes1: ${err}`);
    console.log(JSON.stringify(err));*/

    //console.log(`-->signup-> email:${email} password: ${password}`);
    const {user, error} = yield call(Fire.shared.signup, {email, password} );
    if(user){
        //console.log(`FIREBASE-SIGNED_UP_USER: ${user.uid}`);
        yield put({type: SIGNED_UP});
        navigate('Main');
    }
    else{
        //console.log(`ERROR - FIREBASE-SIGNUP: ${error.message}`);
        yield put({type: ADD_ERROR, payload: error.message});
    }
}
export function* watchSignup(){
        //const {email, password} = yield take(SIGNUP);
        //console.log(`watchSignup-> email:${email} password: ${password}`);
        //yield fork(signup, email, password); //Works
        yield takeLatest(SIGNUP, signup);
}

function* signin({email, password}){
    //console.log(`-->signin-> email:${email} password: ${password}`);
    const {user, error} = yield call(Fire.shared.signin, {email, password} );
    if(user){
        //console.log(`FIREBASE-SIGN_IN_USER: ${user.uid}`);
        yield put({type: SIGNED_IN});
        navigate('Main');
    }
    else{
        //console.log(`ERROR - FIREBASE-SIGNIN: ${error.message}`);
        yield put({type: ADD_ERROR, payload: error.message});
    }
}
export function* watchSignin(){
    yield takeLatest(SIGNIN, signin);
}

export function* watchSignout(){
    yield take(SIGNOUT);
    //console.log(`-->signout-> `);    
    const {success, error} = yield call(Fire.shared.signout);
    if(success){
        navigate('Signin');
        yield put({type: SIGNED_OUT});
    }
    else{
        yield put({type: ADD_ERROR, payload: error.message});
    }    
}
