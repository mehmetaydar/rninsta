import { put, fork, select, take, call, takeLatest, takeEvery} from 'redux-saga/effects';
import {navigate} from '../navigationRef';

import {types} from '../actions/actionProfile';    
import {Fire, fr, frh, rsf} from '../database/Fire';
import Uploader from '../database/Uploader';


function* loadprofile({uid}){
    console.log(`-->loadprofile-> uid:${uid} `); 
    /*const value = yield call(rsf.database.read, path);
    console.log(`--->readref->path.value=${value}`);*/
    const doc = yield call(rsf.database.read, `/people/${uid}`);    
    //console.log(JSON.stringify(doc));
    if(doc){
        console.log("User profile - doc: ");
        console.log(JSON.stringify(doc));
        yield put({type: types.r_profileinfo, 
            payload: {full_name:doc.full_name, url:doc.url, bio:doc.bio, profile_picture:doc.profile_picture} 
        });    
    }    
}
export function* watchLoadprofile(){
    console.log("Watch load profile");
    yield takeLatest(types.s_loadprofile, loadprofile); 
}

function* nbposts({uid}){
    console.log(`-->nbposts-> uid:${uid} `); 
    yield fork(
        rsf.database.sync,
        `people/${uid}/posts`,
        { 
            successActionCreator: (snapshot) => {
            console.log("======SNAPSHOT.DATA=========")
            console.log(JSON.stringify(snapshot));// = people/uid/posts                                             
            //const nb = snapshot ? snapshot.numChildren() : 0;
            const nb = snapshot ? Object.keys(snapshot).length : 0;
            console.log("VALUE TO SYNC - nbposts: ");
            console.log(JSON.stringify(nb));
            return ({
                type: types.r_profile_nb,
                payload: {nbtype: "nbposts", nb},
            }); 
            },
            failureActionCreator: (error) => {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,<<<<<<<<<<<<<<<<<<<<<<<<ERROR ON SYNC - nbposts: ");
            console.log(JSON.stringify(error));
            return ({
                type: types.r_error,
                payload: {error},
            }); 
            }
        }
    );    
}
export function* watchnbposts(){
    console.log("Watch nbposts");
    yield takeLatest(types.s_profile_nbposts, nbposts); 
}

function* nbfollowers({uid}){
    console.log(`-->nbfollowers-> uid:${uid} `); 
    yield fork(
        rsf.database.sync,
        `followers/${uid}`,
        { 
            successActionCreator: (snapshot) => {
            console.log("======SNAPSHOT.DATA=========")
            console.log(JSON.stringify(snapshot));// = followers/uid                                             
            const nb = snapshot ? snapshot.numChildren() : 0;
            console.log("VALUE TO SYNC - nbfollowers: ");
            console.log(JSON.stringify(nb));
            return ({
                type: types.r_profile_nb,
                payload: {nbtype: "nbfollowers", nb},
            }); 
            },
            failureActionCreator: (error) => {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,<<<<<<<<<<<<<<<<<<<<<<<<ERROR ON SYNC - nbfolloers: ");
            console.log(JSON.stringify(error));
            return ({
                type: types.r_error,
                payload: {error},
            }); 
            }
        }
    );    
}
export function* watchnbfollowers(){
    console.log("Watch nbfollowers");
    yield takeLatest(types.s_profile_nbfollowers, nbfollowers); 
}

function* nbfollowing({uid}){
    console.log(`-->nbfollowing-> uid:${uid} `); 
    yield fork(
        rsf.database.sync,
        `people/${uid}/following/`,
        { 
            successActionCreator: (snapshot) => {
            console.log("======SNAPSHOT.DATA=========")
            console.log(JSON.stringify(snapshot));// = people_following/uid                                             
            const nb = snapshot ? snapshot.numChildren() : 0;
            console.log("VALUE TO SYNC - nbfollowing: ");
            console.log(JSON.stringify(nb));
            return ({
                type: types.r_profile_nb,
                payload: {nbtype: "nbfollowing", nb},
            }); 
            },
            failureActionCreator: (error) => {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,<<<<<<<<<<<<<<<<<<<<<<<<ERROR ON SYNC - nbfollowing: ");
            console.log(JSON.stringify(error));
            return ({
                type: types.r_error,
                payload: {error},
            }); 
            }
        }
    );    
}
export function* watchnbfollowing(){
    console.log("Watch nbfollowing");
    yield takeLatest(types.s_profile_nbfollowing, nbfollowing); 
}

function* loadprofileposts({uid}){
    console.log(`-->loadprofileposts-> uid:${uid} `); 
    const data = yield frh.getUserFeedPosts(uid);
    //frh.getUserFeedPosts(uid);
    console.log("======frh.getUserFeedPosts=========")
    console.log(JSON.stringify(data));// = people_following/uid
    yield put({type: types.r_profile_posts, payload: {entries: data.entries, nextPage: data.nextPage}});    
}
export function* watchLoadProfilePosts(){
    console.log("Watch watchLoadProfilePosts");
    yield takeLatest(types.s_profile_posts, loadprofileposts); 
}

//uploadprofilepic
function* uploadprofilepic({image}){
    console.log(`-->uploadprofilepic-> image:${image.type} `); 
    //pics = await Uploader._generateImages(resourcePath);
    const pics = yield call(Uploader._generateImages, image);    
    const profile_picture = yield frh.uploadProfilePic(pics.thumb);  //profile pic should have been updated now
    yield put({type: types.r_uploadprofilepic, payload: {profile_picture}});    
}
export function* watchUploadProfilePic(){
    console.log("Watch watchUploadProfilePic");
    yield takeLatest(types.s_uploadprofilepic, uploadprofilepic); 
}
