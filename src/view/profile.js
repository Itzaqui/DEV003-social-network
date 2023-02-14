import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase-app';

const auth = getAuth();

export default () => {
  const viewProfile = /* html */ `
  <!--<img class = "fondoLogin" src = "images/fondoLogin.png">-->
  <header class="header">
    <nav class="nav">
      <h1>cakeBook</h1>
      <div class="btn-signOut">
        <button type="button" class="signOut" id="signOut">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </nav>
  </header>
  <div class="cover-profile" id="cover">
  <img src="./img/userPic.png" alt="" class="myPic">
  <h2 id="profNameUser">My name</h2>
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
        <li><button type="button" class="postBtn" id="btn-photo"><i class="fas fa-camera-retro"></i></button></li>
        <li><button id="publicar" class="postBtn"><i class="far fa-paper-plane"></i></button></li>
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

//CREATE POSTS:
function writePost() {
  const formInput = document.getElementById('form-post');
  const textPublication = document.getElementById('texto');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
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

  //Cargar datos perfil

  writePost();

  // CARGAR POSTS;
  const templatePosts = document.getElementById('posts');
  const containerMisPosts = document.getElementById('mis-posts');

  const loadPosts = (data) => {
    containerMisPosts.textContent = '';
    if (data) {
      data.forEach((doc) => {
        const dataPost = doc.data();
        const cloneTemplatePosts = document.importNode(
          templatePosts.content,
          true
        );
        const h2userName = cloneTemplatePosts.getElementById('user-name');
        const pDescription = cloneTemplatePosts.getElementById('description');
        const pTime = cloneTemplatePosts.getElementById('time');
        h2userName.textContent = dataPost.userName;
        pDescription.textContent = dataPost.description;
        pTime.textContent = dataPost.time?.toDate().toLocaleString() || '';
        const textPublication = document.getElementById('texto');
        textPublication.focus();
        containerMisPosts.appendChild(cloneTemplatePosts);
      });
    } else {
      containerListPosts.textContent = 'No hay publicación';
    }
  };


  // list posts for auth state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      const unsub = onSnapshot(collection(db, 'post'), (querySnapshot) => {
        loadPosts(querySnapshot); 
      });
    } else {
      history.pushState(null, null, '/');
    }
  });
};
