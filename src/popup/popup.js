// HTML Elements
const settingToggleEl = document.querySelector("#setting-toggle");
const headerIconEl = document.querySelector("#header-icon");
const unhookContentEl = document.querySelector("#unhook-content");

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

  headerIconEl.innerHTML = ``;
  unhookContentEl.innerHTML = ``;
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
