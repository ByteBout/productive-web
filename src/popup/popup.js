// HTML Elements
const headerIconEl = document.querySelector("#header-icon");
const appearanceTabEl = document.querySelector("#appearance-tab");
const unhookContentEl = document.querySelector("#unhook-content");
const appearanceContentEl = document.querySelector("#appearance-content");
const optCtrlEl = document.querySelector("#option-controller");

let sld;
let activeTab;
let optCtrlStatus;
let activeOptions = [];

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
  activeTab = tabs[0].id;
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

async function saveOptions(platform, id) {
  // Save active options to browser storage
  if (activeOptions.includes(id)) {
    const i = activeOptions.indexOf(id);
    activeOptions.splice(i, 1);
  } else {
    activeOptions.push(id);
  }

  await api.storage.sync.set({ [platform]: activeOptions });

  api.tabs.sendMessage(activeTab, {
    type: "options",
    data: activeOptions,
  });
}

function optionController() {
  // Turn on/off options and save option controller status to browser storage
  let optCtrlStatus = optCtrlEl.children[0].textContent;
  let optionsEl = document.querySelectorAll(".option");

  if (optCtrlStatus === "Off") {
    optCtrlEl.children[0].textContent = "On";
    optCtrlStatus = "On";

    optionsEl.forEach((el) => {
      el.children[0].disabled = false;
    });

    for (id of activeOptions) {
      document.querySelector("#" + id).children[0].checked = true;
    }
  } else {
    optCtrlEl.children[0].textContent = "Off";
    optCtrlStatus = "Off";

    optionsEl.forEach((el) => {
      el.children[0].disabled = true;
    });

    for (id of activeOptions) {
      document.querySelector("#" + id).children[0].checked = false;
    }
  }

  api.storage.sync.set({ optCtrlStatus: optCtrlStatus });

  api.tabs.sendMessage(activeTab, {
    type: "controller",
    data: optCtrlStatus,
  });
}

function loadPopup() {
  optCtrlEl.children[1].disabled = false;
  headerIconEl.src = `/public/logos/${sld}.svg`;

  // Load options status from browser storage
  api.storage.sync.get(["optCtrlStatus", sld] || [], (data) => {
    data.optCtrlStatus ? (optCtrlStatus = data.optCtrlStatus) : (optCtrlStatus = "On");

    if (data[sld]) activeOptions = data[sld];

    if (optCtrlStatus === "On") {
      optCtrlEl.children[0].textContent = "On";
      optCtrlEl.children[1].checked = true;

      for (id of activeOptions) {
        document.querySelector("#" + id).children[0].checked = true;
      }
    } else {
      document.querySelectorAll(".option").forEach((el) => {
        el.children[0].disabled = true;
      });
    }
  });
}

function loadYoutubeUI() {
  // Load YouTube's specific popup UI
  loadPopup();

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
      <label id="filters" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Filters
        <input type="checkbox" class="toggle toggle-sm toggle-primary" />
      </label>
    </fieldset>

    <fieldset class="fieldset bg-base-100 border-base-300 w-full rounded-box border px-5 pt-2 pb-4">
      <legend class="fieldset-legend">Home Page</legend>
      <label id="feed" class="option label flex flex-row items-center justify-between px-2 select-none">
        Hide Feed
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

  document.querySelectorAll(".option").forEach((el) => {
    el.addEventListener("change", () => {
      saveOptions("youtube", el.id);
    });
  });
}

optCtrlEl.addEventListener("change", optionController);
