import {navigate} from '../navigationRef';
import uuid from 'uuid';
import firebase from 'firebase';

//const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore'); //not sure why we need this, not sure if we are using it

const collectionName = 'instabackend-180da'; //is it true?, realtime database name

class Fire {
  
  constructor() {
    console.log("...............Fire consturctor............");
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