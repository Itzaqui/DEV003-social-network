import { signOut } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase-app';

export default () => {
  const viewProfile = /* html */ `
  <!--<img class = "fondoLogin" src = "images/fondoLogin.png">-->
  <header class="header">
    <nav class="nav">
    <button class='logo'><h1>cakeBook</h1></button>
      <div class="btn-signOut">
        <button type="button" class="signOut" id="signOut">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </nav>
  </header>
  <div class="cover-profile" id="cover">
  <img src="./img/userPic.png" alt="" class="myPic">
  <h2 id="profNameUser">My Name</h2>
  <h4 id="profInfo">Edad, descripción de perfil</h4>
  <button type="button" class="editProfile" id="editProfile">Editar perfil</button>
  </div>
  <div class="containerProfile">
    <form id="form-post" class="myPosts">
       <h3>¿Qué vamos a compartir hoy?</h3>
        <div class="header-post"> 
          <div class="img-perfil">
            <img src="./img/userPic.png" alt="" class="imgUser">
          </div>
          <textarea  class="text-post" id="texto" placeholder="" autofocus></textarea>
        </div>
      <ul class="nav-myPost">
        <li><button id="publicar" class="postBtn"><i class="far fa-paper-plane"></i></button>
        <li><button type="button" class="postBtn" id="btn-photo"><i class="fas fa-camera-retro"></i></button></li>
       </li>
      </ul> 
    </form>
    <div id="mis-posts">
    </div>
    <template id="posts">
      <div class="myPosts">
        <div class="header-post"> 
          <div class="img-perfil">
            <img src="./img/userPic.png" alt="" class="imgUser">
          </div>
          <h3 id="user-name">User-name</h3> 
        </div>
        <div>
          <!-- <img src="./img/image-post.png" alt="" class="imgUser">-->
          <p id="description">Aquí va el post</p>
          <p id="time" class="time">Time</p>
        </div>
        <ul class="nav-myPost">
          <li><button class="postBtn" id="btn-liked"><i class="far fa-heart"></i></button></li>
          <li><button class="postBtn"><i class="far fa-edit"></i></button></li>
          <li><button class="postBtn"><i class="far fa-trash-alt"></i></button></li> 
        </ul>
      </div>
    </template>    
  </div>
  `;
  document.querySelector('.footer').style.display = 'flex';

  const profileContainer = document.createElement('div');
  profileContainer.classList.add('profile-container');
  profileContainer.innerHTML = viewProfile;

  return profileContainer;
};

// CREATE POSTS:

function writePost() {
  const formInput = document.getElementById('form-post');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const textPublication = document.getElementById('texto');
    addDoc(collection(db, 'post'), {
      userName: auth.currentUser.displayName,
      description: textPublication.value,
      time: Timestamp.fromDate(new Date()),
    }).then(() => {
      formInput.reset();
      textPublication.focus();
    });
  });
}

export const init = () => {
  const buttonSignOut = document.getElementById('signOut');
  buttonSignOut.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        history.pushState(null, null, '/');
      })
      .catch((error) => {
        console.log(error);
      });
    document.querySelector('.footer').style.display = 'none';
  });

  const logoCakebook = document.querySelector('.logo');
  logoCakebook.addEventListener('click', () =>
    history.pushState(null, null, '/cakebook')
  );

  writePost();

  auth.onAuthStateChanged((user) => {
    if (!user) {
      history.pushState(null, null, '/');
      document.querySelector('.footer').style.display = 'none';
    }
    const loggedUser = auth.currentUser;
    if (loggedUser) {
      const h2Name = document.getElementById('profNameUser');
      h2Name.textContent = auth.currentUser.displayName;
    }
  });
};
