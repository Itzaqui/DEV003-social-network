// aqui exportaras las funciones que necesites
export const myFunction = () => {
  // aqui tu codigo
  console.log('Hola mundo!');
};

export const addRouteEvents = () => {
  const oldPushState = history.pushState;

  history.pushState = function pushState(...args) {
    const ret = oldPushState.apply(this, args);
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };

  window.addEventListener('popstate', () =>
    window.dispatchEvent(new Event('locationchange')),
  );
};
