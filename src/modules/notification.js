import Notiflix from 'notiflix';
import { API, scrollCheker } from '../index';
import refs from './refs';

export function errorNotFound() {
  refs.gallery.innerHTML = '';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

export function totalCount(data = {}) {
  if (data.hits.length) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
}

export function isEndList(data = {}) {
  let currentPage = API.page;
  let totalPage = Math.ceil(data.totalHits / 40);
  if (totalPage === currentPage) {
    scrollCheker.isStopScroll = true;
    return Notiflix.Notify.info(
      'We`re sorry, but you`ve reached the end of search results.'
    );
  }
}
