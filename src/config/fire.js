import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCRogiWqX14J-GQub6YN25ozakMiRc4tgk",
    authDomain: "sharemusic-7f76e.firebaseapp.com",
    databaseURL: "https://sharemusic-7f76e.firebaseio.com",
    projectId: "sharemusic-7f76e",
    storageBucket: "sharemusic-7f76e.appspot.com",
    messagingSenderId: "56498364983",
    appId: "1:56498364983:web:e27ef5f3df95d024fa55b2",
    measurementId: "G-TJ43VPQWP3"
  };
  const fire=firebase.initializeApp(firebaseConfig);
  
export default fire;