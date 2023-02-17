/* eslint-disable no-alert */
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase-app';
import { loginWithGoogle } from '../lib/google-auth';

export default () => {
  const viewLogin = `
    <div class="img-container">
      <picture>
        <source media="(max-width: 599px)" srcset="/img/back-login.png" />
        <source media="(min-width: 600px) and (max-width: 1023px)" srcset="/img/back-login-tablet.png" />
        <img src="/img/back-login-desktop.png" alt="" />
      </picture>
    </div>
    <div class= "container1">
      <h1>cakeBook</h1>
      <form class= "form-login" id="form-login">
        <input class= "input-users" type="email" name="userEmail" id="userEmail" placeholder="Correo electrónico" required>
        <input class= "input-users" type="password" name="password" id="password"  placeholder="Contraseña" required>
        <button class="log-button" id="login">INICIAR SESIÓN</button>
        <button type="button" class="log-button" id="register">REGISTRARSE</button>
        <div class="login-google">
          <button type="button" id="btn-google-register"> 
            <div class="login-google">
              <span><img class = "logo" src = "/img/Logo2.png"></span>
              <span class="spn-google">Ingresar con Google</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  `;

  const loginContainer = document.createElement('div');
  loginContainer.classList.add('login-container');
  loginContainer.innerHTML = viewLogin;
  return loginContainer;
};

function loginWithEmailAndPassword(e) {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      history.pushState(null, null, '/cakebook');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errors = {
        'auth/wrong-password': 'Contraseña inválida',
        'auth/user-not-found': 'Correo no registrado',
      };
      const msgError = errors[errorCode] || 'Error, intente nuavemente.';
      alert(msgError);
    });
}

export const init = () => {
  const buttonLogin = document.getElementById('form-login');
  buttonLogin.addEventListener('submit', loginWithEmailAndPassword);

  const buttonRegister = document.getElementById('register');
  buttonRegister.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState(null, null, '/register');
  });

  const buttonGoogle = document.querySelector('#btn-google-register');
  buttonGoogle.addEventListener('click', loginWithGoogle);

  // observatorio de estado
  auth.onAuthStateChanged((user) => {
    if (user) {
      history.pushState(null, null, '/cakebook');
    }
  });
};
