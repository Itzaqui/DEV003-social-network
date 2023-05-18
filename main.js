// Este es el punto de entrada de tu aplicacion

import './lib/firebase-app';

import { myFunction, addRouteEvents } from './lib/index.js';

import { authController } from './controllers/authController.js';

myFunction();
addRouteEvents();

const init = () => {
  authController(window.location.pathname);
  window.addEventListener('locationchange', () => {
    authController(window.location.pathname);
  });
  const profileBtn = document.getElementById('perfilBtn');
  const homeBtn = document.getElementById('homeBtn');
  profileBtn.addEventListener('click', () => history.pushState(null, null, '/profile'));
  homeBtn.addEventListener('click', () => history.pushState(null, null, '/cakebook'));
};

window.addEventListener('load', init);
