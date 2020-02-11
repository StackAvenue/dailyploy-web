import Rebase from "re-base";
import firebase from "firebase";

// const config = {
//   apiKey: process.env.REACT_APP_FIREBASE_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyB0cXXa5EgpsNnbdlf59O6T2eGNcxN1QFY",
  authDomain: "dailyploy-test.firebaseapp.com",
  databaseURL: "https://dailyploy-test.firebaseio.com",
  projectId: "dailyploy-test",
  storageBucket: "dailyploy-test.appspot.com",
  messagingSenderId: "412043137914",
  appId: "1:412043137914:web:4b40a55a68485dc4edbcc3",
  measurementId: "G-EGX49SE4ZK"
};

const base = firebase.initializeApp(firebaseConfig);
// console.log(app.database());
// const base = Rebase.createClass(app.database());

export { base };
