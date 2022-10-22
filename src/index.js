import ApiService from './api/fetchSearchApi';
import refs from './modules/refs';
import 'lazysizes';
import { addHeaderTransform, removeHeaderTransform } from './modules/animation';
import { goToTop, toTopBtnShow } from './modules/scrollToTop';
import { errorNotFound, totalCount, isEndList } from './modules/notification';
import { galleryHandler } from './modules/gallery';
import ImgCard from './templates/imgCard.hbs';

export const API = new ApiService();

export const scrollCheker = {
  isStopScroll: false,
  idDelayScrollCheker: 0,
};

window.onscroll = toTopBtnShow;

refs.formSubmit.addEventListener('submit', onSubmit);
refs.topBtn.addEventListener('click', goToTop);
refs.submit.addEventListener('focus', onSubmit);

refs.gallery.addEventListener('click', galleryHandler);

refs.input.onfocus = addHeaderTransform;
refs.input.onblur = removeHeaderTransform;

async function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.input.blur();
  API.resetPage();
  scrollCheker.isStopScroll = false;
  clearTimeout(scrollCheker.idDelayScrollCheker);
  await getData(1);
}

async function getData(check = 0) {
  try {
    let searchData = refs.input.value.trim();
    if (!searchData.length) return;
    API.query = searchData;
    const data = await API.onFetch();
    if (!data.hits.length) return errorNotFound();

    if (check === 1) {
      await renderFirst(data.hits);
      await checkHighAutoScroll();
      totalCount(data);
    } else {
      isEndList(data);
      await renderMore(data.hits);
      await checkHighAutoScroll();
    }
  } catch (error) {
    console.log(error);
  }
}

async function renderMore(res = {}) {
  let markup = await ImgCard(res);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

async function renderFirst(res = {}) {
  if (res.length < 40 && res.length > 0) scrollCheker.isStopScroll = true;
  let markup = await ImgCard(res);
  refs.gallery.innerHTML = markup;
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

async function checkHighAutoScroll() {
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
    pageYOffset + window.innerHeight + 1 >= scrollHeight &&
    !scrollCheker.isStopScroll
  ) {
    clearTimeout(scrollCheker.idDelayScrollCheker);
    await onGetMore();
  } else {
    scrollCheker.idDelayScrollCheker = setTimeout(checkHighAutoScroll, 1);
  }
}
