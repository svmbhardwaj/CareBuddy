// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjIbH2v5iOA1zwmQYWuGFp1pxgp3QLX5M",
  authDomain: "carebuddy-82273.firebaseapp.com",
  projectId: "carebuddy-82273",
  storageBucket: "carebuddy-82273.firebasestorage.app",
  messagingSenderId: "742921434248",
  appId: "1:742921434248:web:8ff7a7e3fd35bcc65f5b3d",
  measurementId: "G-QJYPL3F83G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);