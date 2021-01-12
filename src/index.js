import './styles.css';
import 'lodash';
import template from './template.hbs';

const inputRef = document.querySelector('[id=search-form]');
const galerryRef = document.querySelector('[class=gallery]');
const imageRef = document.querySelector('[class=image]');
const loadMoreButtonRef = document.querySelector('[id=js-button');
const headers = {
  key: '19685928-f191ac91b9da632ea9a4b744f',
};
let pageSize = 12;
let pageNumber;
let searchQuery;

function createMarkUp(data) {
  galerryRef.insertAdjacentHTML('beforeend', template(data));
}

function imageSearch(queryInput, pageNumber) {
  console.log(document.body.clientHeight);
  fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${queryInput}&page=${pageNumber}&per_page=${pageSize}&key=${headers.key}`,
  )
    .then(res => res.json())
    .then(data => {
      createMarkUp(data.hits);
      let newListItemNumber = (pageNumber - 1) * pageSize;
      let newListItem = document
        .querySelector('.gallery')
        .querySelectorAll('li')[newListItemNumber];
      let newListItemrect = newListItem.getBoundingClientRect();
      console.log(newListItemNumber, newListItem, newListItemrect);
      window.scrollTo({
        //top: document.body.scrollHeight + inputRect.bottom,
        top: window.pageYOffset + newListItemrect.top,
        behavior: 'smooth',
      });
    })
    .catch(error => console.log(error));
}

const delayedSearch = _.debounce(event => {
  galerryRef.innerHTML = '';
  loadMoreButtonRef.classList.remove('hidden');
  if (!event.target.value) {
    return;
  }
  pageNumber = 1;
  searchQuery = event.target.value;
  imageSearch(searchQuery, pageNumber);
}, 1000);

inputRef.addEventListener('input', delayedSearch);

const loadMore = () => {
  imageSearch(searchQuery, (pageNumber += 1));
};

//imageRef.addEventListener('focus', );
loadMoreButtonRef.addEventListener('click', loadMore);
