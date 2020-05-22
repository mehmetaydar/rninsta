import { put, fork, select, take, call, takeLatest, takeEvery} from 'redux-saga/effects';
import {navigate} from '../navigationRef';
import { LOCAL_SIGNIN, CLEAR_ERROR_MESSAGE, SIGNUP, SIGNIN, SIGNOUT, 
    SIGNED_UP,SIGNED_IN,SIGNED_OUT, ADD_ERROR} from '../actions';
import {S_READREF, R_READREF, S_SYNCREF, R_SYNCREF} from '../actions/actionFire';    
import {Fire, fr, frh, rsf} from '../database/Fire';


function* readref({path, key1, key2}){
    console.log(`-->readref-> path:${path} , ${key1}.${key2} `);
    /*const value = yield call(rsf.database.read, path);
    console.log(`--->readref->path.value=${value}`);*/
    let value = null;
    const snapshot = yield call(rsf.firestore.getDocument, path);    
    if(snapshot.exists){
        const doc = snapshot.data();
        let value = doc;
        if(key2 !== null)
            value = doc[key2]; //we are reading a document field       
        //else we are reading a document    
    }
    console.log("VALUE TO READ: ");
    console.log(JSON.stringify(value));
    yield put({type: R_READREF, payload: {value, key1, key2}});    
}
export function* watchReadref(){
    //yield takeLatest(S_READREF, readref);
    yield takeEvery(S_READREF, readref);
}

function* syncref({path, key1, key2}){
    console.log(`-->syncref-> path:${path} , ${key1}.${key2}`);
    /*yield fork(rsf.database.sync, path, 
        { successActionCreator: _value => ({
            type: R_SYNCREF,
            payload: {value:_value, key1, key2},
          }) }
    );*/
    yield fork(
        rsf.firestore.syncDocument,
        path,
        { 
         successActionCreator: (snapshot) => {
            console.log(JSON.stringify(snapshot.data()));// = {"profile_picture":null,"_search_index":{"reversed_full_name":"ty r","full_name":"r ty1"},"full_name":"r ty1"}            
            const doc = snapshot.data();
            let value = doc;
            if(key2 !== null)
                value = doc[key2]; //we are reading a document field                       
            //else we are reading a document
            console.log("VALUE TO SYNC: ");
            console.log(JSON.stringify(value));
            return ({
                type: R_SYNCREF,
                payload: {value, key1, key2},
            }); 
          },
          failureActionCreator: (error) => {
            console.log("ERROR ON SYNC: ");
            console.log(JSON.stringify(error));
            return ({
                type: R_SYNCREF,
                payload: {value: null, key1, key2},
            }); 
          }
        }
    );
}
export function* watchSyncref(){
    //yield takeLatest(S_READREF, readref);
    yield takeEvery(S_SYNCREF, syncref);
}

