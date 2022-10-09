import ApiService from './api/fetchSearchApi';
import ImgCard from './templates/imgCard.hbs';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import debounce from './modules/debounce';

const refs = {
  formSubmit: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
};
const API = new ApiService();
const lightBox = new SimpleLightbox('.gallery a', {
  loop: true,
  enableKeyboard: true,
  docClose: true,
});
let stopScroll = false;

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight &&
    !stopScroll
  ) {
    debounce(onGetMore(), 1500);
  }
});

refs.formSubmit.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  API.resetPage();
  stopScroll = false;
  getData(1);
  totalCount();
}
async function getData(check) {
  try {
    API.query = refs.input.value.trim();
    const data = await API.onFetch();
    if (!data.hits.length) {
      errorNotFound();
    }

    if (check === 1) {
      renderFirst(data.hits);
    } else {
      renderMore(data.hits);
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
