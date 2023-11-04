import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';  // Import storage module

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCynH0qoCyvEO9bxD_T_kWlh86dntA_tv4",
    authDomain: "insta-clone-8e21f.firebaseapp.com",
    projectId: "insta-clone-8e21f",
    storageBucket: "insta-clone-8e21f.appspot.com",
    messagingSenderId: "34103125213",
    appId: "1:34103125213:web:9db81cd1f0c79f6b622734",
    measurementId: "G-W15Y2PKEPL"

  })
  const db =firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage}