// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDroMYkokEf4gnvqhBYRRiqO20UI3YfFYA",
  authDomain: "cakebook-spa.firebaseapp.com",
  databaseURL: "https://cakebook-spa-default-rtdb.firebaseio.com",
  projectId: "cakebook-spa",
  storageBucket: "cakebook-spa.appspot.com",
  messagingSenderId: "422725777",
  appId: "1:422725777:web:6ad9ef2b72623681639730",
  measurementId: "G-4FDPQZCHB0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const deletePost = (id) => deleteDoc(doc(db, 'post', id));
export const likePost = (id, userId) => {
  const docRef = doc(db, 'post', id);
  const docObt = getDoc(docRef);
  docObt.then(() => {
    const postLikes = docObt.data().postLikes;
    const postCount = docObt.data().LikesSum;

    if (!postLikes.includes(userId)) {
      updateDoc(docRef, {
        postLikes: arrayUnion(userId),
        LikesSum: postCount + 1,
      });
    } else {
      updateDoc(docRef, {
        postLikes: arrayRemove(userId),
        LikesSum: postCount - 1,
      });
    }
  });
};
