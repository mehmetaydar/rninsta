import {navigate} from '../navigationRef';
import uuid from 'uuid';
import getUserInfo from 'utils/getUserInfo';
import shrinkImageAsync from 'utils/shrinkImageAsync';
import uploadPhoto from 'utils/uploadPhoto';
import ReduxSagaFirebase from 'redux-saga-firebase';

//import firebase from 'firebase';
import firebaseConfig from 'database/firebase-config.json';
import firebase from 'firebase/app';

// Configure Firebase.
const myFirebaseApp = firebase.initializeApp(firebaseConfig.result);

import FirebaseHelper from './FirebaseHelper';
export const frh = new FirebaseHelper();

//const firebase = require('firebase');
// Required for side-effects
//require('firebase/firestore'); //not sure why we need this, not sure if we are using it

const collectionName = 'instabackend-180da'; //is it true?, realtime database name
//define utilities from insta-backend(friendly-pix)

export class Fire {
  constructor() {    
    // Some nonsense...
    //this wasn't working on my settings
    //firebase.firestore().settings({ timestampsInSnapshots: true });        
  }

  test({email, password, fullname}){
    console.log("fire.test");
    return new Promise((resolve, reject) => {
        uid = "rIxsSJGeQqdpk9oogwvjGc3pHt53";
        fullname = fullname.trim().replace('  ', ' ');
        firebase.database().ref(`/people/${uid}`).set({
            /*_search_index: {
              full_name: fullname,
              reversed_full_name: fullname.split(' ').reverse().join(' ')
            },*/
            full_name: fullname,
            //notificationEnabled: true                  
          });
        resolve({user});
      })
  }

  authStateChanged(params) {
    //console.log(`param: ${param}`);
    //yield put({type: SIGNIN});
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                console.log("AUTH SUCCess firebase");                
                console.log(`User.displayName: ${user.displayName}`);
                resolve({user});
            }
            else{
                //reject(new Error('Ops!'));
                resolve({user: null});
            }
        });
    }); 
  } 

  signup({email, password, fullname}){
    console.log("fire.Signup");
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(({user}) =>{ 
            if (!fullname) 
              fullname = 'Anonymous';
            fullname = fullname.trim().replace('  ', ' ');
            user.updateProfile({
              displayName: fullname
            }).then((s)=> {
              console.log(`s: ${s}`);
              console.log(`User displayName is updated with: ${fullname}`);
              console.log(`User.displayName: ${user.displayName}`);                            
              frh.updatePublicProfile();
            });
            /*fullname = fullname.trim().replace('  ', ' ');
            firebase.database().ref(`/people/${user.uid}`).set({
                _search_index: {
                  full_name: fullname,
                  reversed_full_name: fullname.split(' ').reverse().join(' ')
                },
                full_name: fullname,
                notificationEnabled: true                  
              });*/
            resolve({user});            
        })
        .catch(function(error){
            console.log(error.message);
            resolve({user: null, error});
            //reject(error);
        })
    });
  }

  signin = async({email, password}) => {
    console.log("fire.Signin");
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({user}) =>{ 
            resolve({user});
          })
        .catch(function(error){
            console.log(error.message);
            resolve({user: null, error});
            //reject(error);
        })
    });
  };

  signout = async() => {
    console.log("fire.Signout");
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() =>{ 
            resolve({success: true});
          })
        .catch(function(error){
            console.log(error.message);
            resolve({success: false, error});
        })
    });
  };
  
  // Download Data
  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const post = doc.data() || {};

          // Reduce the name
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            name: (name || 'Secret Duck').trim(),
            ...post,
          };
          data.push(reduced);
        }
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch ({ message }) {
      alert(message);
    }
  };

  
  // Upload Data
  uploadPhotoAsync = async uri => {
    const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
    return uploadPhoto(uri, path);
  };

  post = async ({ text, image: localUri }) => {
    try {
      const { uri: reducedImage, width, height } = await shrinkImageAsync(
        localUri,
      );

      const remoteUri = await this.uploadPhotoAsync(reducedImage);
      this.collection.add({
        text,
        uid: this.uid,
        timestamp: this.timestamp,
        imageWidth: width,
        imageHeight: height,
        image: remoteUri,
        user: getUserInfo(),
      });
    } catch ({ message }) {
      alert(message);
    }
  };
  

  // Helpers
  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }
}
export const fr = new Fire();
export const rsf = new ReduxSagaFirebase(myFirebaseApp); //redux-saga-firebase