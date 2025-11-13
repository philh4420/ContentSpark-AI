
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// FIX: Import firebase functions to be used for social media authentication.
import 'firebase/compat/functions';

// Hardcoded Firebase config to fix the API key error
const firebaseConfig = {
  apiKey: "AIzaSyBBM9a-v3ZaKbMbPNwOY0EBNTEJybK__P4",
  authDomain: "contentspark-ai-de894.firebaseapp.com",
  projectId: "contentspark-ai-de894",
  storageBucket: "contentspark-ai-de894.firebasestorage.app",
  messagingSenderId: "709312134733",
  appId: "1:709312134733:web:a00ce2d9df025833fe2604"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
// FIX: Export firebase functions to be used for social media authentication.
export const functions = firebase.functions();

export default firebase;
