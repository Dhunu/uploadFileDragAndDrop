import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABkGdyyV4YFb9Kx76cI_imYhmKqxXEBcg",
    authDomain: "uploadfile-1b7b9.firebaseapp.com",
    projectId: "uploadfile-1b7b9",
    storageBucket: "uploadfile-1b7b9.appspot.com",
    messagingSenderId: "452414752612",
    appId: "1:452414752612:web:8e26aa96725f0390b41c71",
    measurementId: "G-N9H7SF03NP"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }