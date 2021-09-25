import firebase from "firebase/app";
import "firebase/storage";
import "firebase/messaging"

const config = {
  apiKey: "AIzaSyDsTL_n-QfmV48cGDbaCK_zjSbVEI9XEzA",
  authDomain: "vrcommerce-dee8f.firebaseapp.com",
  databaseURL: "https://vrcommerce-dee8f.firebaseio.com",
  projectId: "vrcommerce-dee8f",
  storageBucket: "vrcommerce-dee8f.appspot.com",
  messagingSenderId: "286274690055",
  appId: "1:286274690055:web:1132bc4d6c82f7da91dea2",
  measurementId: "G-BPRMG2JJKC",
};

firebase.initializeApp(config);

const storage = firebase.storage();
const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;

export { storage, messaging, firebase as default };
