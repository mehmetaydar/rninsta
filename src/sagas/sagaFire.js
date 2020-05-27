import { put, fork, select, take, call, takeLatest, takeEvery} from 'redux-saga/effects';
import {navigate} from '../navigationRef';
import { LOCAL_SIGNIN, CLEAR_ERROR_MESSAGE, SIGNUP, SIGNIN, SIGNOUT, 
    SIGNED_UP,SIGNED_IN,SIGNED_OUT, ADD_ERROR} from '../actions';
import {Fire, fr, frh, rsf} from '../database/Fire';

import {fire_types} from '../actions/actionFire';


function* readref({path, key1, key2}){
    console.log(`-->readref-> path:${path} , ${key1}.${key2} `);
    const value = yield call(rsf.database.read, path);
    console.log(`--->readref->path.value=${value}`);
    yield put({type: fire_types.R_READREF, payload: {value, key1, key2}});    
}
export function* watchReadref(){
    //yield takeLatest(S_READREF, readref);
    yield takeEvery(fire_types.S_READREF, readref);
}

function* syncref({path, key1, key2}){
    console.log(`-->syncref-> path:${path} , ${key1}.${key2}`);
    yield fork(rsf.database.sync, path, 
        { 
          successActionCreator: (_value) => {
            console.log("======DATA _value=========")
            console.log(JSON.stringify(_value));
                return ({
                    type: fire_types.R_SYNCREF,
                    payload: {value:_value, key1, key2},
                }); 
            },
            failureActionCreator: (error) => {
                console.log("ERROR ON SYNC - syncref: ");
                console.log(JSON.stringify(error));
                return ({
                    type: fire_types.R_SYNCREF,
                    payload: {value:null, key1, key2},
                }); 
            } 
        }
    );
    //console.log(`--->syncref->path.value=${value}`);
    //yield put({type: R_SYNCREF, payload: {value: "sync2 fullname", key1, key2}});    
    //yield put({type: R_READREF, payload: {value: "2read fullname", key1, key2}});    
}
export function* watchSyncref(){
    //yield takeLatest(S_READREF, readref);
    yield takeEvery(fire_types.S_SYNCREF, syncref);
}