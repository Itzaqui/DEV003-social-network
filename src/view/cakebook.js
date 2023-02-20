import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  doc,
} from 'firebase/firestore';
import { db, deletePost, addLike, createPost, auth, getPost, removeLike } from '../lib/firebase-app';


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
          <textarea  class="text-post" id="texto" placeholder="" autofocus></textarea>
        </div>
      <ul class="nav-myPost">
        <li><button type="button" class="postBtn" id="btn-photo" title="Subir foto"><i class="fas fa-camera-retro"></i></button></li>
        <li><button id="publicar" class="postBtn" title="Publicar"><i class="far fa-paper-plane"></i></button></li>
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
          <p id="time" class="time">Time</p>
        </div>
        <ul class="nav-myPost nav-posts">
          <div class="div-like">
          <li><button class="postBtn btn-like" id="btn-liked" title="Like"><i class="far fa-heart i-like"></i></button></li>
          <li><span class="sumLikes"></span></li>
          </div>
          <li><button class="postBtn btn-edit"  title="Editar"><i class="far fa-edit"></i></button></li>
          <li><button type="button" class="postBtn btn-delete" title="Eliminar"><i class="far fa-trash-alt"></i></button></li> 
        </ul>
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

//CREATE POSTS:
function writePost() {
  const formInput = document.getElementById('form-post');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const textPublication = document.getElementById('texto');
    createPost({
    userName: auth.currentUser.displayName,
    description: textPublication.value,
    time: Timestamp.fromDate(new Date()),
    LikesSum: 0,
    likes: [],
  }).then(() => {
      textPublication.value='';
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

  writePost();

  // CARGAR POSTS;
  const templatePosts = document.getElementById('posts');
  const containerListPosts = document.getElementById('list-posts');
  const loadPosts = (data) => {
    containerListPosts.textContent = '';
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
        const btnDelete = cloneTemplatePosts.querySelector('.btn-delete');
        btnDelete.setAttribute('data-id', doc.id);
        const btnEdit = cloneTemplatePosts.querySelector('.btn-edit');
        const btnLike = cloneTemplatePosts.querySelector('.btn-like');
        const iLike = cloneTemplatePosts.querySelector('.i-like');
        btnLike.setAttribute('data-id', doc.id);
        const spanSumLikes = cloneTemplatePosts.querySelector('.sumLikes');

        // if (dataPost.likes && dataPost.likes.length) {
        //   spanSumLikes.textContent = dataPost.likes.length;
        // } else {
        //   spanSumLikes.textContent = '';
        // }
        spanSumLikes.textContent = dataPost.likes?.length || '';
        h2userName.textContent = dataPost.userName;
        pDescription.textContent = dataPost.description;
        pTime.textContent = dataPost.time?.toDate().toLocaleString() || '';
        const textPublication = document.getElementById('texto');
        textPublication.focus();
        containerListPosts.appendChild(cloneTemplatePosts);
        if (auth.currentUser.displayName === dataPost.userName) {
          btnDelete.style.display = 'inline-block';
          btnEdit.style.display = 'inline-block';
        }
        if (dataPost.likes?.includes(auth.currentUser.uid)) {
          iLike.style.color = 'rgb(212, 23, 105)';
        }
      });
      eventDelete();
      eventEdit();
      eventLike();
    } else {
      containerListPosts.textContent = 'No hay publicación';
    }
  };

  //Eliminar post
  function eventDelete() {
    const btnsDelete = containerListPosts.querySelectorAll('.btn-delete');
    btnsDelete.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        deletePost(id);
        console.log(id);
        console.log('deleting');
      });
    });
  }

  //Editar Posts
  function eventEdit() {
    const btnsEdit = containerListPosts.querySelectorAll('.btn-edit');
    btnsEdit.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Editing');
      });
    });
  }

  function eventLike() {
    const btnsLike = containerListPosts.querySelectorAll('.btn-like');
    btnsLike.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const userId = auth.currentUser.uid;
        getPost(id)
        .then((docLike) => {
          const userLike = docLike.data().likes;
          if(userLike.includes(userId)) {
            removeLike(id, userId);
          } else {
            addLike(id, userId);
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    });
  }

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
