import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  addBookMark,
  getSearchResultsPage,
  loadRecipe,
  loadSearchResults,
  removeBookmark,
  state,
  updateServings,
  uploadRecipe,
} from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
// update this module without reloading the page
if (module.hot) {
  module.hot.accept();
}
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    // render spiner
    recipeView.renderSpiner();
    // 0) Update results view to mark selected search result
    resultsView.update(getSearchResultsPage());
    // 1) Updating bookmarks view
    bookmarksView.update(state.bookmarks);
    // 2) Loading recipe
    await loadRecipe(id);
    // 3) Rendering recipe
    recipeView.render(state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchRicipes = async function () {
  try {
    resultsView.renderSpiner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await loadSearchResults(query);
    // 3) Render results
    resultsView.render(getSearchResultsPage());
    // 4) Render initial pagination buttons
    paginationView.render(state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (pageNum) {
  // 3) Render results
  resultsView.render(getSearchResultsPage(pageNum));
  // 4) Render initial pagination buttons
  paginationView.render(state.search);
};
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  updateServings(newServings);
  // Update the recipe view
  recipeView.update(state.recipe);
};
const controlAddBookMark = function () {
  // 1) Add/remove bookmark
  if (!state.recipe.bookmarked) addBookMark(state.recipe);
  else removeBookmark(state.recipe.id);
  // 2) Update recipe view
  recipeView.update(state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpiner();
    // Upload the new recipe data
    await uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // Render the bookmark view
    bookmarksView.render(state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${state.recipe.id}`);
    // Close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
};
//?Publisher-Subscriber-Pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchRicipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
