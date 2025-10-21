import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0WOCOxWBb43HPoxoqmZbqNdtdQ3wrr5o",
  authDomain: "english-vocab-b337e.firebaseapp.com",
  projectId: "english-vocab-b337e",
  storageBucket: "english-vocab-b337e.appspot.com",
  messagingSenderId: "33226962213",
  appId: "1:33226962213:web:ad9f342ced2691389916cc"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };

