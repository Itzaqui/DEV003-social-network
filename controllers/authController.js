import { routes } from '../routes/route.js';

const authController = (route) => {
  const containerMain = document.getElementById('main');
  containerMain.innerHTML = '';
  let component = null;
  if (route === '/') {
    component = routes.login;
  } else if (route === '/register') {
    component = routes.register;
  } else if (route === '/cakebook') {
    component = routes.cakebook;
  } else if (route === '/profile') {
    component = routes.profile;
  }
  containerMain.appendChild(component.view());
  component.init();
  return containerMain;
};

export { authController };
