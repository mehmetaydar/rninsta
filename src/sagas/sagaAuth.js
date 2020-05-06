import {AsyncStorage} from 'react-native';
import { put, fork, select, take, call, takeLatest} from 'redux-saga/effects'
import {navigate} from '../navigationRef';
import { LOCAL_SIGNIN, CLEAR_ERROR_MESSAGE, SIGNUP, SIGNIN, SIGNOUT } from '../actions';
import { apiAuth } from 'services'

function* getAsyncToken(){
    const token = yield AsyncStorage.getItem('token');
    console.log(`getAsyncToken: ${token}`);
    if(token){
        //dispatch({type: 'signin', payload: token});
        //dispatch yerine yield put({type: , payload: }) koyuyorsun reducer a gondermek icin
        yield put({type: 'signin', payload: token});
        navigate('TrackList');
    }
    else{
        navigate('Signup');
    }
};

export function* watchTryLocalSignin() {
    //take latest
    const acc = yield take(LOCAL_SIGNIN); //burdaki actionin actions ta export edilmis olmasi gerekiyor
                              //componentta ayni action typeini kullanirsan burda handle edilir
    
    console.log(`sagaAuth->watchTryLocalSignin2: ${acc.type}`);                          
    yield getAsyncToken();
}

export function* watchClearErrorMessage(){
    //console.log("called clearErrorMessage");
    yield take(CLEAR_ERROR_MESSAGE);
    yield put({type: 'clear_error_message'});
}

function* signup({email, password}){
    console.log(`-->signup-> email:${email} password: ${password}`);
    try{        
        const response = yield apiAuth.post('/signup', {email, password});
        //const response = yield call(apiAuth.post('/signup', {email, password}));
        //console.log(response.data);
        yield AsyncStorage.setItem('token', response.data.token);
        yield put({type: 'signin', payload: response.data.token});
        navigate('TrackList');
    }catch(err){
        console.log(err);
        yield put({type: 'add_error', payload: 'Something went wrong with sign up'});
    }
}
export function* watchSignup(){
        //const {email, password} = yield take(SIGNUP);
        //console.log(`watchSignup-> email:${email} password: ${password}`);
        //yield fork(signup, email, password); //Works
        yield takeLatest(SIGNUP, signup);
}

function* signin({email, password}){
    console.log(`-->signup-> email:${email} password: ${password}`);
    try{
        const response = yield call(apiAuth.post('/signin', {email, password}));
        //console.log(response.data);
        yield AsyncStorage.setItem('token', response.data.token);
        yield put({type: 'signin', payload: response.data.token});
        navigate('TrackList');
    }catch(err){
        //console.log(err.response.data);
        yield put({type: 'add_error', payload: 'Something went wrong with sign in'});
    }
}
export function* watchSignin(){
    yield takeLatest(SIGNIN, signin);
}

export function* watchSignout(){
    yield take(SIGNOUT);
    yield AsyncStorage.removeItem('token');
    yield put({type: 'signout'});
    navigate('loginFlow');
}
