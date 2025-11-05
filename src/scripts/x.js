const targetElements = {
  feed: ["[aria-label='Timeline: Your Home Timeline']"],
  premium: [
    "div:has(> div > div[data-testid='super-upsell-UpsellCardRenderProperties'])",
    "a[href='/i/premium_sign_up']",
  ],
  "who-to-follow": ["div:has(> div > aside[aria-label='Who to follow'])"],
  trending: ["div:has(> section > div[aria-label='Timeline: Trending now'])"],
  grok: ["a[aria-label='Grok']", "[data-testid='GrokDrawer']", "[aria-label='Grok actions']"],
  explore: ["a[href='/explore']"],
  notifications: ["a[href='/notifications']"],
  messages: ["a[href='/messages']"],
  communities: ["[aria-label='Communities']"],
  stats: [
    "[data-testid='reply'] > div > div > span",
    "[data-testid='retweet'] > div > div > span",
    "[data-testid='like'] > div > div > span",
    "a[href*='/status/'][href$='/analytics'] > div > div > span",
    "[href*='/verified_followers'] > span:nth-child(1) > span",
    "[href*='/following'] > span:nth-child(1) > span",
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

async function blockFeed(options) {
  // Disable receiving updates for the feed content via network when "Hide Feed" is activated
  try {
    options.includes("feed")
      ? await chrome.runtime.sendMessage({ disableXFeed: true })
      : await chrome.runtime.sendMessage({ disableXFeed: false });
  } catch {}
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "options":
      activeOptions = message.data;
      unhook(activeOptions);
      blockFeed(activeOptions);
      break;
    case "controller":
      optCtrlStatus = message.data;
      optCtrlStatus === "Off" ? unhook([]) : unhook(activeOptions);
      break;
  }
});

api.storage.sync.get(["optCtrlStatus", "x"], (data) => {
  activeOptions = data.x;
  optCtrlStatus = data.optCtrlStatus;
});

const observer = new MutationObserver(() => {
  if (optCtrlStatus !== "Off") {
    unhook(activeOptions);
    blockFeed(activeOptions);
  }
});

observer.observe(document.body, { childList: true });
document.addEventListener("unload", () => observer.disconnect);
