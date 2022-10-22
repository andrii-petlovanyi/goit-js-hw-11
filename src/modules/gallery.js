import refs from './refs';

export function galleryHandler(e) {
  if (e.target.tagName !== 'IMG') return;

  const prevImg = e.target.dataset.src;
  const fullImg = e.target.dataset.big;

  const imgList = getImgList();
  let ind = imgList.findIndex(elem => elem.big === fullImg);
  ind += 1;

  createMarkupGallery(prevImg, fullImg, ind, imgList.length);
}

export function nextHandler(e) {
  refs.mod.querySelector('.next').removeEventListener('click', nextHandler);

  const img = e.target.parentNode.querySelector('img');

  const el = img.dataset.src;
  const imgList = getImgList();
  let ind = imgList.findIndex(elem => elem.big === el);
  ind += 1;
  if (ind >= imgList.length) return;
  const prevImg = imgList[ind].src;
  const fullImg = imgList[ind].big;
  createMarkupGallery(prevImg, fullImg, ind + 1, imgList.length);
}

export function prevHandler(e) {
  refs.mod.querySelector('.next').removeEventListener('click', prevHandler);

  const img = e.target.parentNode.querySelector('img');

  const el = img.dataset.src;
  const imgList = getImgList();
  let ind = imgList.findIndex(elem => elem.big === el);
  ind -= 1;
  if (ind < 0) return;
  const prevImg = imgList[ind].src;
  const fullImg = imgList[ind].big;
  createMarkupGallery(prevImg, fullImg, ind + 1, imgList.length);
}

export function getImgList() {
  const imgList = refs.gallery.querySelectorAll('img');
  const newArr = [];
  imgList.forEach(elem => newArr.push(elem.dataset));
  return newArr;
}

export function createMarkupGallery(prevImg = '', fullImg = '', ind, len) {
  const markup = `
    <div class="modal">
      <div class="container">
      <button class='prev' type="button" data-set="prev"></button>
      <button class='next' type="button" data-set="next"></button>
      <p class="counter">${ind}/${len}</p>
      <div class="wrap">
          <img class="lazyload" data-src=${fullImg} src=${prevImg}></img>
        </div>
      </div>
    </div>
  `;

  refs.mod.innerHTML = markup;
  document
    .querySelector('.modal')
    .addEventListener('click', handlerRemoveMarkup);
  refs.mod.querySelector('.next').addEventListener('click', nextHandler);
  refs.mod.querySelector('.prev').addEventListener('click', prevHandler);
}

export function handlerRemoveMarkup(e) {
  if (e.target.tagName === 'BUTTON') return;
  document
    .querySelector('.modal')
    .removeEventListener('click', handlerRemoveMarkup);
  refs.mod.querySelector('.next').removeEventListener('click', nextHandler);
  refs.mod.querySelector('.prev').removeEventListener('click', prevHandler);
  document.querySelector('.modal').remove();
}
