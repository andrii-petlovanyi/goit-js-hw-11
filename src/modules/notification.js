import { Notify } from 'notiflix';
import { API, scrollChecker } from '../index';
import refs from './refs';

export function errorNotFound() {
  refs.gallery.innerHTML = '';
  showNotification(notification.messages.noResults, notification.types.fail);
}

export function totalCount(totalHits = 0) {
  if (totalHits === 500) {
    showNotification(
      notification.messages.foundAll(totalHits),
      notification.types.info
    );
  } else if (totalHits > 0 && totalHits < 500) {
    showNotification(
      notification.messages.found(totalHits),
      notification.types.info
    );
  }
}

export function isEndList(totalHits = 0) {
  let currentPage = API.page;
  let totalPage = Math.ceil(totalHits / 40);
  if (totalPage === currentPage) {
    scrollChecker.isStopScroll = true;
    return showNotification(
      notification.messages.endList,
      notification.types.info
    );
  }
}

export const notification = {
  types: { fail: 'failure', info: 'info' },
  messages: {
    foundAll: total => `Hooray! We found ${total + 20} images.`,
    found: total => `Hooray! We found ${total} images.`,
    noResults: `Sorry, there are no images matching your search query. Please try again.`,
    endList: `We're sorry, but you've reached the end of search results.`,
  },
};

export function showNotification(message = '', type = 'info', timeout = 5000) {
  Notify[type](message, { timeout });
}
