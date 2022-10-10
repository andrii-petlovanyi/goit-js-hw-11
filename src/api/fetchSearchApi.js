import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30473687-5047ffac8f3617cf871b8e4a3';
const IMAGES_PER_PAGE = 40;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = IMAGES_PER_PAGE;
  }

  async onFetch() {
    try {
      const resp = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: this.page,
          per_page: this.per_page,
        },
      });
      return await resp.data;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
