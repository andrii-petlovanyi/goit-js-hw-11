import refs from './refs';

export function smoothScrollPage() {
  const { height: cardHeight } =
    refs.gallery.lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

export function goToTop() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
}

export function scrollFunction() {
  refs.topBtn.style.display =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
      ? 'flex'
      : 'none';
}
