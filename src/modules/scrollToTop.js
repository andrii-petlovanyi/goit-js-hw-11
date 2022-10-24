import refs from './refs';

export function goToTop() {
  document.body.scrollTop = 0; // for Safari
  document.documentElement.scrollTop = 0; // for Chrome, Firefox, IE and Opera
}

export function toTopBtnShow() {
  refs.toTopBtn.style.display =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
      ? 'flex'
      : 'none';
}
