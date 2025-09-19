function getBrowserInfo() {
  // Detect user browser type
  if (typeof browser !== "undefined") {
    return browser;
  } else {
    return chrome;
  }
}

const api = getBrowserInfo();