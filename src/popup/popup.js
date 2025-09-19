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
  headerIconEl.src = "";

  unhookContentEl.innerHTML = ``;
}
