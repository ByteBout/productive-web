// HTML Elements
const settingToggleEl = document.querySelector("#setting-toggle");
const headerIconEl = document.querySelector("#header-icon");
const unhookContentEl = document.querySelector("#unhook-content");
const appearanceContentEl = document.querySelector("#appearance-content");
const appearanceTabEl = document.querySelector("#appearance-tab");

function getBrowserInfo() {
  // Detect the user's browser type
  if (typeof browser !== "undefined") {
    return browser;
  } else {
    return chrome;
  }
}

const api = getBrowserInfo();

// Get the second-level domain of the active tab
api.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;
  const sld = url.replace(/(https:\/\/)|www\.|\.[^.]*$/g, "");

  // Load platform-specific UI based on SLD
  if (platforms[sld]) {
    platforms[sld]();
  }
});

const platforms = {
  youtube: loadYoutubeUI,
};

function loadPopupUI() {
  settingToggleEl.children[1].removeAttribute("disabled");

  // Load setting toggle status
  api.storage.sync.get(["settingToggle"] || [], (data) => {
    if (data.settingToggle) {
      settingToggleEl.children[0].textContent = data.settingToggle;
    } else {
      settingToggleEl.children[0].textContent = "Off";
    }

    if (data.settingToggle === "On") {
      settingToggleEl.children[1].setAttribute("checked", "checked");
    }
  });
}

function loadYoutubeUI() {
  // Load YouTube's specific popup UI
  loadPopupUI();

  headerIconEl.innerHTML = ` 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-primary h-full">
      <g>
        <path
          d="M23.498,6.186c-0.276-1.039-1.089-1.858-2.122-2.136C19.505,3.546,12,3.546,12,3.546s-7.505,0-9.377,0.504   C1.591,4.328,0.778,5.146,0.502,6.186C0,8.07,0,12,0,12s0,3.93,0.502,5.814c0.276,1.039,1.089,1.858,2.122,2.136   C4.495,20.454,12,20.454,12,20.454s7.505,0,9.377-0.504c1.032-0.278,1.845-1.096,2.122-2.136C24,15.93,24,12,24,12   S24,8.07,23.498,6.186z M9.546,15.569V8.431L15.818,12L9.546,15.569z" />
      </g>
    </svg>
  `;
  unhookContentEl.innerHTML = `
    <fieldset class="fieldset bg-base-100 border-base-300 -mt-2 w-full rounded-lg border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">General</legend>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Ads
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Shorts
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Notifications
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-lg border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Home Page</legend>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Feed
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Filters
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-lg border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Sidebar</legend>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Subscriptions
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Explore
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide More from YouTube
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-lg border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Video Page</legend>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Recommendations
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Comments
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Playlist
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Live Chat
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-lg border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Video</legend>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Disable Autoplay
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide End Screen Cards
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
      <label class="label flex flex-row items-center justify-between px-2 select-none">
        Hide Video Wall
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>
  `;
}

settingToggleEl.addEventListener("change", () => {
  // Save the setting toggle status to storage
  let status = settingToggleEl.children[0].textContent;

  if (status === "Off") {
    settingToggleEl.children[0].textContent = "On";
    status = "On";
  } else {
    settingToggleEl.children[0].textContent = "Off";
    status = "Off";
  }

  api.storage.sync.set({ settingToggle: status });
});
