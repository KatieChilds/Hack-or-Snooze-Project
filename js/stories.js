"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${
          story.url
        }" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${
          story.author
        }</small>
        <small class="story-user">posted by ${
          story.username
        }</small>
      </li>
    `);
}

function getDeleteBtnHTML() {
  return `<span class="trash-can">
  <i class="fas fa-trash-alt"></i>
  </span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<span class="star">
  <i class="${starType} fa-star"></i>
  </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Creates a new story from submit-form inputs, hides submit-form, adds new story to page

async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();

  const title = $("#create-title").val();
  const author = $("#create-author").val();
  const url = $("#create-url").val();

  let story = { title, author, url };
  let user = currentUser;

  await storyList.addStory(user, story);

  putStoriesOnPage();

  $submitStoryForm.hide();
  $submitStoryForm.trigger("reset");
}

$storySubmitBtn.on("click", submitNewStory);

// creates a separate list of favorited stories for a logged in user
function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append(
      "<h5>No favorites added!</h5>"
    );
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story, false);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");

  const story = storyList.stories.find(
    (s) => s.storyId === storyId
  );

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click", ".star", toggleStoryFavorite);

// Creates a separate list of user's own stories for a logged in user
async function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

// Deletes a story created by the logged in user
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);
