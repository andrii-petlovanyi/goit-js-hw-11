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
  // btnMore: document.querySelector('.more'),
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
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight &&
      !stopScroll
    ) {
      onGetMore();
    }
  }, 300)
);
window.onscroll = function () {
  scrollFunction();
};

refs.formSubmit.addEventListener('submit', onSubmit);
refs.topBtn.addEventListener('click', goToTOp);
// refs.btnMore.addEventListener('click', onGetMore);

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
    } else {
      await renderMore(data.hits);
    }
    checkEndOfResult(data);
  } catch (error) {
    console.log(error.message);
  }
}
async function renderMore(res) {
  let markup = await ImgCard(res);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightBox.refresh();
  smoothScrollPage();
}

async function renderFirst(res) {
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

function onGetMore() {
  API.incrementPage();
  getData();
}

async function totalCount() {
  const data = await API.onFetch();
  if (data.hits.length) {
    Notiflix.Notify.info(`Hooray! We found ${data.total} images.`);
  }
}

function checkEndOfResult(data) {
  if (data.hits.length < API.per_page && data.hits.length !== 0) {
    stopScroll = true;
    Notiflix.Notify.info(
      'We`re sorry, but you`ve reached the end of search results.'
    );
    return;
  }
}

function smoothScrollPage() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
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
