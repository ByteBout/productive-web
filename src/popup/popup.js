// HTML Elements
const headerIconEl = document.querySelector("#header-icon");
const unhookContentEl = document.querySelector("#unhook-content");

let sld;

function getBrowserInfo() {
  // Detect user browser type
  if (typeof browser !== "undefined") {
    return browser;
  } else {
    return chrome;
  }
}

const api = getBrowserInfo();

// Get second-level domain of active tab
api.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;
  sld = url.replace(/(https:\/\/)|www\.|\.[^.]*$/g, "");

  // Load platform-specific UI based on SLD
  if (platforms[sld]) {
    platforms[sld]();
  }
});

const platforms = {
  youtube: loadYoutubeUI,
};

function loadYoutubeUI() {
  // Load YouTube's specific popup UI
  headerIconEl.src = "/public/logos/youtube.svg";

  unhookContentEl.innerHTML = `
    <fieldset class="fieldset bg-base-100 border-base-300 -mt-2 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">General</legend>
      <label id="ads" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Ads
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="shorts" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Shorts
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="notif" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Notifications
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Home Page</legend>
      <label id="feed" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Feed
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="filters" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Filters
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Sidebar</legend>
      <label id="side-subs" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Subscriptions
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label
        id="side-explore"
        class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Explore
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="side-more" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide More from YouTube
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Video Page</legend>
      <label
        id="recommendations"
        class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Recommendations
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="comments" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Comments
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="playlist" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Playlist
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="live-chat" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Live Chat
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Video</legend>
      <label id="autoplay" class="option label flex flex-row items-center justify-between px-2 select-none">
        Disable Autoplay
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="cards" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide End Screen Cards
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label id="wall" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Video Wall
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>
  `;
}
