import Notiflix from 'notiflix';
import { API, stopScroll, refs } from '../index';

export function errorNotFound() {
  refs.gallery.innerHTML = '';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

export async function totalCount() {
  const data = await API.onFetch();
  if (data.hits.length) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
}

export async function isEndList(data) {
  let currentPage = API.page;
  let totalPage = Math.ceil((await data.totalHits) / 40);
  if (totalPage === currentPage) {
    stopScroll.isTrue = true;
    return Notiflix.Notify.info(
      'We`re sorry, but you`ve reached the end of search results.'
    );
  }
}
