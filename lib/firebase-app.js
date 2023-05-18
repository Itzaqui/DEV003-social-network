/* eslint-disable no-trailing-spaces */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDroMYkokEf4gnvqhBYRRiqO20UI3YfFYA',
  authDomain: 'cakebook-spa.firebaseapp.com',
  databaseURL: 'https://cakebook-spa-default-rtdb.firebaseio.com',
  projectId: 'cakebook-spa',
  storageBucket: 'cakebook-spa.appspot.com',
  messagingSenderId: '422725777',
  appId: '1:422725777:web:6ad9ef2b72623681639730',
  measurementId: 'G-4FDPQZCHB0',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const deletePost = (id) => deleteDoc(doc(db, 'post', id));

export const addLike = (id, userId) => {
  updateDoc(doc(db, 'post', id), { likes: arrayUnion(userId) });
};

export const removeLike = (id, userId) => {
  updateDoc(doc(db, 'post', id), { likes: arrayRemove(userId) });
};

export const createPost = (data) => addDoc(collection(db, 'post'), data);

export const getPost = (id) => getDoc(doc(db, 'post', id));

export const updatePost = (id, newFields) => updateDoc(doc(db, 'post', id), { ...newFields });

export const orderedPost = (callback) => {
  const q = query(collection(db, 'post'), orderBy('time', 'desc'));
  onSnapshot(q, callback);
};
