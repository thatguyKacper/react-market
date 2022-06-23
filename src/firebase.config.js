import { initializeApp } from 'firebase/app';
import { getFiestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDx0a68I5AzKEmFsv07yqh3lb-2_uJJSaQ',
  authDomain: 'react-market-cb0ec.firebaseapp.com',
  projectId: 'react-market-cb0ec',
  storageBucket: 'react-market-cb0ec.appspot.com',
  messagingSenderId: '658586638404',
  appId: '1:658586638404:web:1f10344938f54e231dc411',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFiestore();
