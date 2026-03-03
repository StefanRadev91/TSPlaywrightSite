import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChfG_kVkMVPEz31LijplxiUtjPFvH-ONA",
  authDomain: "tsplaywright-4946e.firebaseapp.com",
  projectId: "tsplaywright-4946e",
  storageBucket: "tsplaywright-4946e.firebasestorage.app",
  messagingSenderId: "1059828883173",
  appId: "1:1059828883173:web:85ad71179f4e4178e3be0c",
  measurementId: "G-H0CXVJ7B8T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
