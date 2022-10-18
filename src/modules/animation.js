import refs from './refs';

export function addHeaderTransform() {
  refs.header.classList.add('header--transform');
}

export function removeHeaderTransform() {
  refs.header.classList.remove('header--transform');
}
