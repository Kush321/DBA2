import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyA9nFKbZunrDPBqDkL6kn3X37kVcxP6xyI',
  authDomain: 'bosaap-42c6d.firebaseapp.com',
  projectId: 'bosaap-42c6d',
  storageBucket: 'bosaap-42c6d.appspot.com',
  messagingSenderId: '839717197645',
  appId: '1:839717197645:web:6d3ecb66d3f565523b8904',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
