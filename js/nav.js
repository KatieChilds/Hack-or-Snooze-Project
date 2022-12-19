"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navLeftOptions.show();
  $loginForm.hide();
  $signupForm.hide();
}

// Show submit form for adding a new story when submit button clicked

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $submitStoryForm.show();
  putStoriesOnPage();
  $navLeftOptions.show();
}

$navSubmit.on("click", navSubmitStoryClick);

// Show user's list of favorited stories when nav bar button clicked
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putFavoritesListOnPage();
  $navLeftOptions.show();
  $favoritedStories.show();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

// Show user's list of own stories when nav bar button clicked
function navMyStories(evt) {
  console.debug("navMyStories");
  hidePageComponents();
  putUserStoriesOnPage();
  $navLeftOptions.show();
  $ownStories.show();
}

$body.on("click", "#nav-ownStories", navMyStories);
