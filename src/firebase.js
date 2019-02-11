import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
  apiKey: "AIzaSyDGvIsSFxYhfF3uDg0se1FDWVWjf-4DQm8",
  authDomain: "slackchat-f7cec.firebaseapp.com",
  databaseURL: "https://slackchat-f7cec.firebaseio.com",
  projectId: "slackchat-f7cec",
  storageBucket: "slackchat-f7cec.appspot.com",
  messagingSenderId: "469334878364"
};

firebase.initializeApp(config);

export default firebase;