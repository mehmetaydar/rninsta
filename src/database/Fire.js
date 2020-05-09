import {navigate} from '../navigationRef';
import uuid from 'uuid';
import getUserInfo from 'utils/getUserInfo';
import shrinkImageAsync from 'utils/shrinkImageAsync';
import uploadPhoto from 'utils/uploadPhoto';
import firebase from 'firebase';

//const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore'); //not sure why we need this, not sure if we are using it

const collectionName = 'instabackend-180da'; //is it true?, realtime database name

class Fire {
  
  constructor() {
    firebase.initializeApp({
        apiKey: "AIzaSyBAiiXY1eKa9Im2RniBDVGPXXGOP3FyMWE",
        authDomain: "instabackend-180da.firebaseapp.com",
        databaseURL: "https://instabackend-180da.firebaseio.com",
        projectId: "instabackend-180da",
        storageBucket: "instabackend-180da.appspot.com",
        messagingSenderId: "855765439258",
        appId: "1:855765439258:web:a4cd4fee25627ac4c212a3",
        measurementId: "G-P21X7RMKT6"
    });
    
    // Some nonsense...
    //this wasn't working on my settings
    //firebase.firestore().settings({ timestampsInSnapshots: true });
  }

  authStateChanged(params) {
    //console.log(`param: ${param}`);
    //yield put({type: SIGNIN});
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                console.log("AUTH SUCCess firebase");                
                resolve({user});
            }
            else{
                //reject(new Error('Ops!'));
                resolve({user: null});
            }
        });
    }); 
  } 

  signup({email, password}){
    console.log("fire.Signup");
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(({user}) =>{ 
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
Fire.shared = new Fire();
export default Fire;