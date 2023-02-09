import { getAuth, signOut } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';
import { collection, getDocs, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase-app';

const auth = getAuth();

export default () => {
  const viewTimeline = /* html */ `
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
  <div class="containerTimeline">
    <form id="form-post" class="myPosts">
       <h2>¿Qué vamos a compartir hoy?</h2>
        <div class="header-post"> 
          <div class="img-perfil">
            <img src="./img/userPic.png" alt="" class="imgUser">
          </div>
          <textarea class="myPosts" class="text-post" id="texto" placeholder="" ></textarea>
        </div>
      <ul class="nav-myPost">
        <li><button type="button" class="postBtn">Foto</button></li>
        <li><button id="publicar" class="postBtn">Publicar</button></li>
      </ul> 
    </form>
    <div id="list-posts">
    </div>
    <template id="posts">
      <div class="myPosts">
        <div class="header-post"> 
          <div class="img-perfil">
            <img src="./img/userPic.png" alt="" class="imgUser">
          </div>
          <h2 id="user-name">User-name</h2> 
        </div>
        <div>
          <!-- <img src="./img/image-post.png" alt="" class="imgUser">-->
          <p id="description">Aquí va el post</p>
        </div>
        <p id="time" class="time">Time</p>
        <!--<ul class="nav-myPost">
          <li><button id ="postBtn" class="postBtn">Liked</button></li>
          <li><button class="postBtn">Editar</button></li>
          <li><button class="postBtn">Eliminar</button></li> 
        </ul>-->
      </div>
    </template>    
  </div>
  `;
  document.querySelector('.footer').style.display = 'flex';

  const cakebookContainer = document.createElement('div');
  cakebookContainer.classList.add('cakebook-container');
  cakebookContainer.innerHTML = viewTimeline;
  return cakebookContainer;
};

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

  // create post;
  function writePost() {
    const btnPublish = document.getElementById('form-post');
    const textPublication = document.getElementById('texto');
    btnPublish.addEventListener('submit', (e) => {
      e.preventDefault();
      const createPost = doc(db, 'post/id');
      const docData = {
        userName: auth.currentUser.displayName,
        description: textPublication.value,
        time: Timestamp.fromDate(new Date()),
      };
      setDoc(createPost, docData);
    });
  }

  // CARGAR POSTS;
  const templatePosts = document.getElementById('posts');
  const containerListPosts = document.getElementById('list-posts');

  const loadPosts = (data) => {
    if (data) {
      data.forEach((doc) => {
        const dataPost = doc.data();
        const cloneTemplatePosts = document.importNode(
          templatePosts.content,
          true,
        );
        const h2userName = cloneTemplatePosts.getElementById('user-name');
        const pDescription = cloneTemplatePosts.getElementById('description');
        const pTime = cloneTemplatePosts.getElementById('time');
        h2userName.textContent = dataPost.userName;
        pDescription.textContent = dataPost.description;
        pTime.textContent = dataPost.time.toDate().toLocaleString();
        containerListPosts.appendChild(cloneTemplatePosts);
      });
    } else {
      containerListPosts.textContent = 'No hay publicación';
    }
  };

  // events
  // list posts for auth state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      writePost();
      getDocs(collection(db, 'post')).then((querySnapshot) => {
        loadPosts(querySnapshot);
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.data());
        // });
      });
    } else {
      history.pushState(null, null, '/');
    }
  });
};
