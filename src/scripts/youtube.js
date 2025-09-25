const targetElements = {
  ads: ["#companion", "#masthead-ad", ".ytd-ad-slot-renderer", "#panels", "ytd-ad-slot-renderer"],
  shorts: [
    "ytd-rich-shelf-renderer",
    "ytd-reel-shelf-renderer",
    ".ytd-shorts",
    "#endpoint[title='Shorts']",
    "grid-shelf-view-model",
    "[is-shorts-grid]",
    "[tab-title='Shorts']",
    "ytd-video-renderer:has(.ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail-overlay-time-status-renderer[aria-label='Shorts'])",
  ],
  notif: ["ytd-notification-topbar-button-renderer"],
  feed: ["[page-subtype='home']"],
  filters: ["#chips-wrapper", "#chips"],
  "side-subs": [
    "#guide-renderer > div > ytd-guide-section-renderer:nth-last-child(4)",
    "#endpoint[title='Subscriptions']",
  ],
  "side-explore": ["#guide-renderer > div > ytd-guide-section-renderer:nth-last-child(3)"],
  "side-more": ["#guide-renderer > div > ytd-guide-section-renderer:nth-last-child(2)"],
  recommendations: ["#related"],
  comments: [".ytd-comments"],
  playlist: ["#playlist"],
  "live-chat": ["#chat-container", "#panels-full-bleed-container", "#teaser-carousel"],
  autoplay: [],
  cards: [".ytp-ce-video", ".ytp-ce-channel-this", ".ytp-ce-website"],
  wall: [".ytp-endscreen-content"],
};

let activeOptions = [];
let optCtrlStatus;
const api = getBrowserInfo();

function getBrowserInfo() {
  if (typeof browser !== "undefined") {
    return browser;
  } else {
    return chrome;
  }
}

function unhook(options) {
  if (!options) return;

  let selectors = [];

  for (const option of options) {
    targetElements[option].forEach((selector) => {
      selectors.push(selector);
    });
  }

  const style = document.querySelector("#productive-web") || document.createElement("style");
  style.id = "productive-web";
  style.textContent = selectors + "{display: none !important;}";
  document.head.appendChild(style);
}

function setAutoplay() {
  try {
    const autoplayEl = document.querySelector(".ytp-autonav-toggle");
    const autoPlayStatus = autoplayEl.getAttribute("data-tooltip-title");

    if (activeOptions.includes("autoplay") && autoPlayStatus.includes("on")) {
      autoplayEl.click();
    } else if (!activeOptions.includes("autoplay") && autoPlayStatus.includes("off")) {
      autoplayEl.click();
    }
  } catch {}
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "options":
      activeOptions = message.data;
      unhook(activeOptions);
      setAutoplay();
      break;
    case "controller":
      optCtrlStatus = message.data;
      optCtrlStatus === "Off" ? unhook([]) : unhook(activeOptions);
  }
});

api.storage.sync.get(["optCtrlStatus", "youtube"], (data) => {
  activeOptions = data.youtube;
  optCtrlStatus = data.optCtrlStatus;
});

const observer = new MutationObserver(() => {
  if (optCtrlStatus !== "Off") unhook(activeOptions);
  setAutoplay();
});
observer.observe(document.body, { childList: true });
