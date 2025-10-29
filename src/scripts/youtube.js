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
    "#endpoint[href='/feed/subscriptions']",
  ],
  "side-explore": ["#guide-renderer > div > ytd-guide-section-renderer:nth-last-child(3)"],
  "side-more": ["#guide-renderer > div > ytd-guide-section-renderer:nth-last-child(2)"],
  recommendations: ["#related"],
  comments: [".ytd-comments"],
  playlist: ["#playlist"],
  "live-chat": ["#chat-container", "#panels-full-bleed-container", "#teaser-carousel"],
  autoplay: [],
  cards: [".ytp-ce-video", ".ytp-ce-channel-this", ".ytp-ce-website"],
  wall: [".ytp-endscreen-content", ".ytp-modern-videowall-still"],
  shop: ["ytd-merch-shelf-renderer"],
  stats: [
    ".yt-content-metadata-view-model__metadata-row:nth-child(2) > .yt-content-metadata-view-model__metadata-text:nth-child(1)",
    ".yt-content-metadata-view-model__metadata-row:nth-child(2) > .yt-content-metadata-view-model__delimiter",
    "#metadata-line > span:nth-child(1)",
    "#metadata-line > span::before",
    ".shortsLockupViewModelHostOutsideMetadataSubhead",
    ".ytd-watch-info-text > span:nth-child(-n+2)",
    "#metadata-line > span:nth-child(3)",
    "#vote-count-middle",
    "#vote-count-left",
    "#thumbnail-attribution",
    "yt-content-metadata-view-model > div:nth-child(3) > span:nth-child(1)",
    "yt-content-metadata-view-model > div:nth-child(3) > span:nth-child(2)",
    ".description-item:has([icon='trending_up'])",
    ".description-item:has([icon='person_radar'])",
    "#thumbnail-attribution",
    ".ytwFeedAdMetadataViewModelHostMetadata > span:nth-child(3)",
    ".ytd-comments-header-renderer > span:nth-child(1)",
    "#owner-sub-count",
    ".ytLikeButtonViewModelHost .yt-spec-button-shape-next--tonal > .yt-spec-button-shape-next__button-text-content",
    "#like-button .yt-core-attributed-string",
    "#comments-button .yt-core-attributed-string",
    "#remix-button .yt-core-attributed-string",
    ".ytLikeButtonViewModelHost .yt-core-attributed-string",
  ],
};

let activeOptions = [];
let optCtrlStatus;
const api = typeof browser !== "undefined" ? browser : chrome;

const style = document.createElement("style");
style.id = "productive-web";
document.head.appendChild(style);

function unhook(options) {
  if (!options) return;

  let selectors = [];

  for (const option of options) {
    targetElements[option].forEach((selector) => {
      selectors.push(selector);
    });
  }

  style.textContent = selectors + "{display: none !important;}";
}

function setAutoplay() {
  if (!window.location.href.includes("youtube.com/watch?v")) return;

  try {
    const autoplayEl = document.querySelector(".ytp-autonav-toggle-button");
    const autoplayStatus = autoplayEl.getAttribute("aria-checked");

    if (activeOptions.includes("autoplay") && autoplayStatus.includes("true")) {
      autoplayEl.click();
    } else if (!activeOptions.includes("autoplay") && autoplayStatus.includes("false")) {
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
document.addEventListener("unload", () => observer.disconnect);
