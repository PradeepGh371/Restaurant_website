// Firebase configuration and initialization for GrandVista Hotel
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAtT3IfKqCqsk5rj-Cit2QybLg1qDEsK5M',
  authDomain: 'hotel-2f8a3.firebaseapp.com',
  projectId: 'hotel-2f8a3',
  storageBucket: 'hotel-2f8a3.firebasestorage.app',
  messagingSenderId: '309179117445',
  appId: '1:309179117445:web:bfb5628b7c19062afe5eec',
  measurementId: 'G-KCPZBMMHW7'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };