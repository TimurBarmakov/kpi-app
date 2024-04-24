import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWJKiQ2cxSasU3EidpBKSBqkAHPpGRfzs",
  authDomain: "kpiproject-9e8c7.firebaseapp.com",
  databaseURL: "https://kpiproject-9e8c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kpiproject-9e8c7",
  storageBucket: "kpiproject-9e8c7.appspot.com",
  messagingSenderId: "959765111309",
  appId: "1:959765111309:web:560073e2b1448579a72b44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const db = getFirestore(app);
export { auth, db };