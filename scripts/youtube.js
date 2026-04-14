const targetElements = {
  ads: [
    ".ytd-ad-slot-renderer",
    "ytd-ad-slot-renderer",
    "ytd-rich-item-renderer[rich-grid-hover-highlight]:has(.ytd-ad-slot-renderer)",
    "[target-id='engagement-panel-ads']",
    ".ytd-player-legacy-desktop-watch-ads-renderer",
  ],
  shorts: [
    "a#endpoint[title='Shorts']",
    "#shorts-inner-container",
    "ytd-rich-section-renderer",
    ".ytGridShelfViewModelHost",
    "[is-shorts-grid]",
    "ytd-guide-entry-renderer:has(a[title='Shorts'])",
    "ytd-video-renderer:has(a[href^='/shorts/'])",
    "#shorts-container",
  ],
  feed: ["ytd-two-column-browse-results-renderer[page-subtype='home']"],
  notifocations: [".ytd-notification-topbar-button-renderer"],
  subscriptions: ["#sections > ytd-guide-section-renderer:nth-last-child(5)", "a[href='/feed/subscriptions']"],
  explore: ["#sections > ytd-guide-section-renderer:nth-last-child(3)"],
  "more-from-youtube": ["#sections > ytd-guide-section-renderer:nth-last-child(2)"],
  recommendations: [".ytd-watch-next-secondary-results-renderer"],
  comments: ["#comments"],
  "live-chat": ["#chat", "#panels-full-bleed-container"],
  shop: ["ytd-merch-shelf-renderer", ".ytd-merch-shelf-renderer"],
  "video-cards": [".ytp-ce-channel-this", ".ytp-ce-large-round", ".ytp-ce-hide-button-container"],
  "video-wall": [".ytp-modern-videowall-still"],
};

let activeOptions;
let powerCondition;

const style = document.createElement("style");
style.setAttribute("id", "productive-web");
document.querySelector("head").appendChild(style);

chrome.storage.sync.get(["youtube", "power"], (data) => {
  activeOptions = data.youtube || [];
  powerCondition = data.power || "on";

  if (data.power === "off") return;

  hideElements(activeOptions);
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.power) powerCondition = request.power;
  if (request.options) activeOptions = request.options;

  powerCondition === "on" ? hideElements(activeOptions) : hideElements([]);
});

function hideElements(options) {
  let selectors = "";

  for (let i = 0; i < options.length; i++) {
    const x = options[i];
    selectors += targetElements[x] + ", ";
  }

  selectors = selectors.substring(0, selectors.length - 2);
  style.innerHTML = `${selectors} {
    display: none;
  }`;
}
