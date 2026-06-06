import View from './view';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _messageErr = 'No bookmarks yet. find a nice recipe and bookmark it ;)';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(bookmarked) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
            <a class="preview__link ${bookmarked.id === id ? 'preview__link--active' : ''}" href="#${bookmarked.id}">
              <figure class="preview__fig">
                <img src="${bookmarked.image}" alt="${bookmarked.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${bookmarked.title}</h4>
                <p class="preview__publisher">${bookmarked.publisher}</p>
                <div class="preview__user-generated ${bookmarked.key ? '' : 'hidden'}">
                    <svg>
                      <use href="${icons}.svg#icon-user"></use>
                    </svg>
                </div>
              </div>
            </a>
          </li>
    `;
  }
}
export default new BookmarksView();
