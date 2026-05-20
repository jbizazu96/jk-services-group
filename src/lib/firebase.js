import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3TqMik0Kfg04mzSMaGA98VslaNYJkjwE",
  authDomain: "jk-services-group.firebaseapp.com",
  projectId: "jk-services-group",
  storageBucket: "jk-services-group.firebasestorage.app",
  messagingSenderId: "978642098732",
  appId: "1:978642098732:web:256f3fa9cf8f84315e8f89",
  measurementId: "G-K0H7CTQRCP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
