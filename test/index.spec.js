// importamos la funcion que vamos a testear
import { myFunction } from '../src/lib/index';
import cakebook, { writePost } from '../src/view/cakebook.js';

describe('myFunction', () => {
  it('debería ser una función', () => {
    expect(typeof myFunction).toBe('function');
  });
});

describe('writePost', () => {
  it('debería ser una función', () => { 
    document.innerHTML = cakebook();
    document.getElementById('texto').value = 'Texto del post';
    writePost();
    document.getElementById('publicar').click();
    expect(createPost).toHaveBeenCalledWith(
      {userName: auth.currentUser.displayName,
      description: 'Texto del post',
      time: Timestamp.fromDate(new Date()),
      LikesSum: 0,
      likes: [],
      });
  });
});