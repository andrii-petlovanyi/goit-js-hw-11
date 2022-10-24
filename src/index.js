import ApiService from './api/fetchSearchApi';
import refs from './modules/refs';
import 'lazysizes';
import { addHeaderTransform, removeHeaderTransform } from './modules/animation';
import { goToTop, toTopBtnShow } from './modules/scrollToTop';
import { errorNotFound, totalCount, isEndList } from './modules/notification';
import { modalHandler } from './modules/gallery';
import ImgCard from './templates/imgCard.hbs';

export const API = new ApiService();

export const scrollChecker = {
  isStopScroll: false,
  idDelayScrollChecker: 0,
};

window.onscroll = toTopBtnShow;

refs.formSubmit.addEventListener('submit', onSubmit);
refs.submitBtn.addEventListener('focus', onSubmit);
refs.toTopBtn.addEventListener('click', goToTop);
refs.gallery.addEventListener('click', modalHandler);

refs.input.onfocus = addHeaderTransform;
refs.input.onblur = removeHeaderTransform;

async function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.input.blur();
  API.resetPage();
  scrollChecker.isStopScroll = false;
  clearTimeout(scrollChecker.idDelayScrollChecker);
  await getResultSearching(1);
}

async function getResultSearching(check = 0) {
  try {
    let searchQuery = refs.input.value.trim();
    if (!searchQuery.length) return;
    API.query = searchQuery;
    const { hits, totalHits } = await API.onFetch();
    if (!hits.length) return errorNotFound();

    if (check === 1) {
      firstRenderSearchingResults(hits);
      totalCount(totalHits);
      await checkingRunInfinityScroll();
    } else {
      moreRenderSearchingResults(hits);
      isEndList(totalHits);
      await checkingRunInfinityScroll();
    }
  } catch (error) {
    console.log(error);
  }
}

function moreRenderSearchingResults(res = {}) {
  let markup = ImgCard(res);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function firstRenderSearchingResults(res = {}) {
  if (res.length < 40 && res.length > 0) scrollChecker.isStopScroll = true;
  let markup = ImgCard(res);
  refs.gallery.innerHTML = markup;
}

async function checkingRunInfinityScroll() {
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
    !scrollChecker.isStopScroll
  ) {
    clearTimeout(scrollChecker.idDelayScrollChecker);
    API.incrementPage();
    await getResultSearching();
  } else {
    scrollChecker.idDelayScrollChecker = setTimeout(
      checkingRunInfinityScroll,
      1
    );
  }
}

// let isPromise = false;
// if (!isPromise) {
//   isPromise = true;
//   apiService.getItems().finally(() => (isPromise = false));
// }
