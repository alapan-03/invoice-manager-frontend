// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXOa930aBALDVkw2rwzK82Dw_m4Ajnsfs",
  authDomain: "geminiinvoice-d77e0.firebaseapp.com",
  projectId: "geminiinvoice-d77e0",
  storageBucket: "geminiinvoice-d77e0.firebasestorage.app",
  messagingSenderId: "321341591833",
  appId: "1:321341591833:web:3cee9aca1bedb6f876f588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);