import ApiService from './api/fetchSearchApi';
import refs from './modules/refs';
import throttle from './modules/throttle';
import { smoothScrollPage, goToTop, toTopBtnShow } from './modules/scrollToTop';
import { errorNotFound, totalCount, isEndList } from './modules/notification';
import ImgCard from './templates/imgCard.hbs';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

export const API = new ApiService();
const lightBox = new SimpleLightbox('.gallery a', {
  loop: true,
  enableKeyboard: true,
  docClose: true,
});
export const stopScroll = {
  isTrue: false,
};

window.addEventListener('scroll', throttle(checkHighAutoScroll, 500));
window.onscroll = toTopBtnShow;

refs.formSubmit.addEventListener('submit', onSubmit);
refs.topBtn.addEventListener('click', goToTop);

async function onSubmit(e) {
  e.preventDefault();
  goToTop();
  API.resetPage();
  stopScroll.isTrue = false;
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
      await isEndList(data);
      await renderMore(data.hits);
    }
  } catch (error) {
    console.log(error);
  }
}
async function renderMore(res) {
  let markup = await ImgCard(res);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  smoothScrollPage();
  lightBox.refresh();
}

async function renderFirst(res) {
  if (res.length < 40 && res.length > 0) stopScroll.isTrue = true;
  let markup = await ImgCard(res);
  refs.gallery.innerHTML = markup;
  lightBox.refresh();
}

export async function onGetMore() {
  let loadedPage = API.page;
  API.incrementPage();
  if (loadedPage !== API.page - 1) {
    API.page = loadedPage;
    return;
  }

  await getData();
}

function checkHighAutoScroll() {
  let scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  let pageYOffset =
    window.pageYOffset == undefined
      ? (document.body || document.documentElement || document.body.parentNode)
          .scrollTop
      : window.pageYOffset;
  if (
    pageYOffset + window.innerHeight + 20 >= scrollHeight &&
    !stopScroll.isTrue
  ) {
    onGetMore();
  }
}
