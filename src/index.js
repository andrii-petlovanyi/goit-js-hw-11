import ApiService from './api/fetchSearchApi';
import ImgCard from './templates/imgCard.hbs';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import throttle from './modules/throttle';

const refs = {
  formSubmit: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  topBtn: document.querySelector('.top-btn'),
};
const API = new ApiService();
const lightBox = new SimpleLightbox('.gallery a', {
  loop: true,
  enableKeyboard: true,
  docClose: true,
});

let stopScroll = false;
window.addEventListener(
  'scroll',
  throttle(() => {
    if (
      window.pageYOffset + window.innerHeight >=
        document.documentElement.scrollHeight &&
      !stopScroll
    ) {
      onGetMore();
    }
  }, 500)
);
window.onscroll = function () {
  scrollFunction();
};

refs.formSubmit.addEventListener('submit', onSubmit);
refs.topBtn.addEventListener('click', goToTOp);

async function onSubmit(e) {
  e.preventDefault();
  goToTOp();
  API.resetPage();
  stopScroll = false;
  await getData(1);
}

async function getData(check) {
  try {
    let searchData = refs.input.value.trim();
    if (!searchData.length) return;
    API.query = searchData;
    const data = await API.onFetch();
    if (!data.hits.length) return errorNotFound();

    if (check === 1) {
      await renderFirst(data.hits);
      await totalCount();
      console.log(data);
    } else {
      isEndList(data);
      await renderMore(data.hits);
    }
  } catch (error) {
    console.log(error);
    if (error === undefined) alert('Stoooop');
  }
}
async function renderMore(res) {
  let markup = await ImgCard(res);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  smoothScrollPage();
  lightBox.refresh();
}

async function renderFirst(res) {
  if (res.length < 40 && res.length > 0) stopScroll = true;
  let markup = await ImgCard(res);
  refs.gallery.innerHTML = markup;
  lightBox.refresh();
}
function errorNotFound() {
  refs.gallery.innerHTML = '';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

async function onGetMore() {
  let loadedPage = API.page;
  console.log(API.page);
  API.incrementPage();
  if (loadedPage !== API.page - 1) {
    API.page = loadedPage;
    return;
  }

  await getData();
}

async function totalCount() {
  const data = await API.onFetch();
  if (data.hits.length) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
}
function smoothScrollPage() {
  const { height: cardHeight } =
    refs.gallery.lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function goToTOp() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
}

function scrollFunction() {
  refs.topBtn.style.display =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
      ? 'flex'
      : 'none';
}

function isEndList(data) {
  let currentPage = API.page;
  let totalPage = Math.ceil(data.totalHits / 40);
  if (totalPage === currentPage) {
    stopScroll = true;
    return Notiflix.Notify.info(
      'We`re sorry, but you`ve reached the end of search results.',
      { zindex: 3 }
    );
  }
}
