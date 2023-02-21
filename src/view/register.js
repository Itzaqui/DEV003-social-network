/* eslint-disable no-alert */
import {
  updateProfile,
} from 'firebase/auth';
import { auth, register } from '../lib/firebase-app';
import { loginWithGoogle } from '../lib/google-auth';

export default () => {
  const viewRegister = /* html */ `
    <div class="img-container">
      <picture>
        <source media="(max-width: 599px)" srcset="/img/back-login.png" />
        <source media="(min-width: 600px) and (max-width: 1023px)" srcset="/img/back-login-tablet.png" />
        <img src="/img/back-login-desktop.png" alt="" />
      </picture>
    </div>
    <div class= "container1">
    <h1>cakeBook</h1>
    <div class="saludo">
      <span>Regístrate para ver y compartir</span> 
      <span> deliciosas recetas con tus amigos!</span> 
    </div>
    <div class="login-google">
    <button id="btn-google-register"> 
      <div class="login-google">
        <span><img class = "logo" src = "/img/Logo2.png"></span>
        <span class="spn-google">Registrarte con Google</span>
      </div>
    </button>
    </div>
    <form class="form-btn">
      <input class= "input-users" type="email" name="email" id="userEmail" placeholder="Correo electrónico">
      <input class= "input-users" type="text" name="fullName" id="userFullName" placeholder="Nombre y Apellido">
      <input class= "input-users" type="text" name="username" id="username" placeholder="Nombre de Usuario">
      <input class= "input-users" type="password" name="password" id="password"  placeholder="Contraseña">
      <div class="span-politica">
        <span>Al registrarte, aceptas nuestras Condiciones, la </span> 
        <span>Política de privacidad y la Política de cookies.</span>
      </div>
      <button class="log-button" id="register">REGISTRARTE</button> 
    </form>
  </div>
`;

  const registerContainer = document.createElement('div');
  registerContainer.classList.add('register-container');
  registerContainer.innerHTML = viewRegister;
  return registerContainer;
};

function handleError(error) {
  const errorCode = error.code;
  const errors = {
    'auth/missing-email': 'Por favor, introduce un correo.',
    'auth/invalid-email': 'Correo inválido.',
    'auth/email-already-in-use': 'Correo ya registrado.',
    'auth/weak-password':
      'Por favor, introduce una contraseña que contenga más de 6 carácteres.',
    'auth/internal-error': 'Por favor, introduce una contraseña.',
  };
  const msgError = errors[errorCode] || 'Error, intente nuevamente.';
  alert(msgError);
}

function registeredUser(userCredential, userForm) {
  // Signed in
  const user = userCredential.user;
  updateProfile(user, {
    displayName: userForm.fullName,
  })
    .then(() => {
      // Profile updated!
      // ...
    })
    .catch((error) => {
      // An error occurred
      // ...
    });
  alert('guardado exitosamente');
}

function registerWithEmailAndPassword(e) {
  e.preventDefault();
  const form = document.querySelector('.form-btn');
  const data = Object.fromEntries(new FormData(form));
  register(data.email, data.password)
    .then((userCredential) => registeredUser(userCredential, data))
    .catch(handleError);
}

export const init = () => {
  const form = document.querySelector('.form-btn');
  form.addEventListener('submit', registerWithEmailAndPassword);

  const buttonGoogle = document.querySelector('#btn-google-register');
  buttonGoogle.addEventListener('click', loginWithGoogle);

  auth.onAuthStateChanged((user) => {
    if (user) {
      form.reset();
      history.pushState(null, null, '/cakebook');
    }
  });
};
