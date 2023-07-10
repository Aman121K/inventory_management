import firebase from "firebase";
var firebaseConfig = {};

firebaseConfig = {
  apiKey: "AIzaSyCNP8DKJKiUyRhooGcDNBPyB0NvtSpBRBY",
  authDomain: "inventory-manager-6d76b.firebaseapp.com",
  projectId: "inventory-manager-6d76b",
  storageBucket: "inventory-manager-6d76b.appspot.com",
  messagingSenderId: "12077219256",
  appId: "1:12077219256:web:e313bd06ab77d8b333634d",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { auth };
export default db;
