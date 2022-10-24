import refs from './refs';

export let currentIndexImg = 0;

export function modalHandler(e) {
  if (e.target.tagName !== 'IMG') return;

  const prevImg = e.target.dataset.src;
  const fullImg = e.target.dataset.big;

  const imgList = getImgList();
  let ind = imgList.findIndex(elem => elem.big === fullImg);

  currentIndexImg = ind;

  createMarkupModal(prevImg, fullImg, ind + 1, imgList.length);
}

export function nextHandler() {
  refs.modalImg
    .querySelector('.next')
    .removeEventListener('click', nextHandler);

  currentIndexImg += 1;
  const imgList = getImgList();
  if (currentIndexImg >= imgList.length) return;
  const prevImg = imgList[currentIndexImg].src;
  const fullImg = imgList[currentIndexImg].big;
  createMarkupModal(prevImg, fullImg, currentIndexImg + 1, imgList.length);
}

export function prevHandler() {
  refs.modalImg
    .querySelector('.next')
    .removeEventListener('click', prevHandler);

  currentIndexImg -= 1;
  const imgList = getImgList();
  if (currentIndexImg < 0) return;
  const prevImg = imgList[currentIndexImg].src;
  const fullImg = imgList[currentIndexImg].big;
  createMarkupModal(prevImg, fullImg, currentIndexImg + 1, imgList.length);
}

export function getImgList() {
  const imgList = refs.gallery.querySelectorAll('img');
  const newArr = [];
  imgList.forEach(elem => newArr.push(elem.dataset));
  return newArr;
}

export function createMarkupModal(prevImg = '', fullImg = '', ind, len) {
  const markup = `
    <div class="modal">
      <div class="container">
      <button class='prev' type="button" data-set="prev"></button>
      <button class='next' type="button" data-set="next"></button>
      <p class='close'></p>
      <p class="counter">${ind}/${len}</p>
      <div class="wrap">
          <img class="lazyload" data-src=${fullImg} src=${prevImg}></img>
        </div>
      </div>
    </div>
  `;

  refs.modalImg.innerHTML = markup;
  document
    .querySelector('.modal')
    .addEventListener('click', handlerRemoveMarkup);
  refs.modalImg.querySelector('.next').addEventListener('click', nextHandler);
  refs.modalImg.querySelector('.prev').addEventListener('click', prevHandler);
  window.addEventListener('keydown', handlerKeydown);
}

export function handlerRemoveMarkup(e) {
  if (e.target.tagName === 'BUTTON') return;
  removeMarkup();
  currentIndexImg = 0;
}

export function removeMarkup() {
  document
    .querySelector('.modal')
    .removeEventListener('click', handlerRemoveMarkup);
  refs.modalImg
    .querySelector('.next')
    .removeEventListener('click', nextHandler);
  refs.modalImg
    .querySelector('.prev')
    .removeEventListener('click', prevHandler);
  document.querySelector('.modal').remove();
  window.removeEventListener('keydown', handlerKeydown);
}

function handlerKeydown(e) {
  if (e.code == 'Escape') removeMarkup();
  if (e.code == 'ArrowRight') nextHandler();
  if (e.code == 'ArrowLeft') prevHandler();
  // console.log(e);
}
