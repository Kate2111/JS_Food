import { nanoid } from 'nanoid';
import { initializeApp } from "firebase/app";
import { getDatabase, get, set, remove, ref, child } from "firebase/database";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9knLZoLZlpSkvNQR6BSW6xOLzlHzkqYM",
  authDomain: "my-project-53597.firebaseapp.com",
  databaseURL: "https://my-project-53597-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "my-project-53597",
  storageBucket: "my-project-53597.appspot.com",
  messagingSenderId: "245011783044",
  appId: "1:245011783044:web:566d98f7ef6124648491d1",
  measurementId: "G-6DQ3FMN5PG"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


function registrationUser(userEmail, userName, userPassword) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, userEmail, userName, userPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

function authorizationUser(userEmail, userName, userPassword) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, userEmail, userName, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export {registrationUser, authorizationUser};
