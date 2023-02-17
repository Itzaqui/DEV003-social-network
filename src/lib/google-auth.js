import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase-app';

function handleError() {
  const msgError = 'Error, intente nuevamente.';
  alert(msgError);
}

function autenticGoogle() {
  history.pushState(null, null, '/cakebook');
}

function loginWithGoogle(e) {
  e.preventDefault();
  console.log('sign google');
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then(autenticGoogle).catch(handleError);
}

export { loginWithGoogle };
