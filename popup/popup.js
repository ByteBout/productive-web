const powerSwitchEl = document.querySelector("#power-switch");
const pageContentEl = document.querySelector("#page-content");

let sld;
let tabId;
const supportedWebsites = {
  youtube: loadYouTubeContent,
  x: loadXContent,
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs && !tabs[0]) return;
  tabId = tabs[0].id;

  // Extract the second-level domain from the URL
  const url = new URL(tabs[0].url);
  const hostname = url.hostname;
  const hostnameParts = hostname.split(".");
  sld = hostnameParts.length == 2 ? hostnameParts[0] : hostnameParts[1];

  sld in supportedWebsites ? supportedWebsites[sld]() : displayAlert();
});

// Load power switch condition from browser storage
chrome.storage.sync.get(["power"], (condition) => {
  const c = condition.power || "on";

  if (c === "off") powerSwitchEl.checked = false;
});

// Save power switch condition to browser storage
powerSwitchEl.addEventListener("change", () => {
  let condition;
  powerSwitchEl.checked ? (condition = "on") : (condition = "off");

  chrome.tabs.sendMessage(tabId, { power: condition, sld: sld });
  chrome.storage.sync.set({ power: condition });
});

function loadOptions(sld) {
  // Load options condition from browser storage
  chrome.storage.sync.get([sld], (options) => {
    const activeOptions = options[sld] || [];

    activeOptions.forEach((option) => {
      document.querySelector("#" + option).checked = true;
    });
  });
}

function saveOption(option, sld) {
  // Save options condition to browser storage
  chrome.storage.sync.get([sld], (options) => {
    let activeOptions = options[sld] || [];

    if (!activeOptions.includes(option)) {
      activeOptions.push(option);
    } else {
      let i = activeOptions.indexOf(option);
      activeOptions.splice(i, 1);
    }

    chrome.tabs.sendMessage(tabId, { options: activeOptions, sld: sld });
    chrome.storage.sync.set({ [sld]: activeOptions });
  });
}

function displayAlert() {
  // Display an alert for unsupported websites and a list of supported websites
  pageContentEl.innerHTML = `
    <div role="alert" class="alert h-fit w-full shadow-xl select-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info h-6 w-6 shrink-0">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="-ml-2 text-sm">"${sld ? sld.toUpperCase() : sld}" isn't supported</span>
    </div>
    <div role="alert" class="alert alert-info alert-soft -z-10 -mt-8 flex flex-col justify-center pt-10 select-none">
      <span class="text-sm font-bold">Supported Websites</span>
      <div class="-mt-2 flex w-full flex-wrap justify-center gap-0.5">
        <div class="badge badge-info badge-xs">YouTube</div>
        <div class="badge badge-info badge-xs">X</div>
      </div>
    </div>
    `;
}

function loadYouTubeContent() {
  pageContentEl.innerHTML = `
      <div class="border-base-300 bg-base-200 rounded-box flex w-full items-center gap-1 border p-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="fill-base-content h-8 w-8">
          <path
            d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" />
        </svg>
        <p class="text-lg">YouTube</p>
      </div>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">General</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="ads" class="toggle toggle-sm toggle-primary" />
          Hide Ads
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="shorts" class="toggle toggle-sm toggle-primary" />
          Hide Shorts
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Home Page</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="feed" class="toggle toggle-sm toggle-primary" />
          Hide Feed
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="notifocations" class="toggle toggle-sm toggle-primary" />
          Hide Notifications
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Sidebar</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="subscriptions" class="toggle toggle-sm toggle-primary" />
          Hide Subscriptions
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="explore" class="toggle toggle-sm toggle-primary" />
          Hide Explore
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="more-from-youtube" class="toggle toggle-sm toggle-primary" />
          Hide More from YouTube
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Video Page</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="recommendations" class="toggle toggle-sm toggle-primary" />
          Hide Recommendations
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="comments" class="toggle toggle-sm toggle-primary" />
          Hide Comments
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="live-chat" class="toggle toggle-sm toggle-primary" />
          Hide Live Chat
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="shop" class="toggle toggle-sm toggle-primary" />
          Hide Shop
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Video</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="video-cards" class="toggle toggle-sm toggle-primary" />
          Hide End Video Cards
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="video-wall" class="toggle toggle-sm toggle-primary" />
          Hide End Video Wall
        </label>
      </fieldset>
  `;

  const options = document.querySelectorAll(".toggle");
  options.forEach((option) => {
    option.addEventListener("change", (e) => saveOption(e.target.id, "youtube"));
  });

  loadOptions("youtube");
}

function loadXContent() {
  pageContentEl.innerHTML = `
      <div class="border-base-300 bg-base-200 rounded-box flex w-full items-center gap-1.5 border p-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-base-content h-8 w-8">
          <polygon points="6.861 6.159 15.737 17.764 17.097 17.764 8.322 6.159 6.861 6.159"/>
          <path d="m12,0C5.373,0,0,5.373,0,12s5.373,12,12,12,12-5.373,12-12S18.627,0,12,0Zm3.063,19.232l-3.87-5.055-4.422,5.055h-2.458l5.733-6.554-6.046-7.91h5.062l3.494,4.621,4.043-4.621h2.455l-5.361,6.126,6.307,8.337h-4.937Z"/>
        </svg>
        <p class="text-lg">X</p>
      </div>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">General</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="grok" class="toggle toggle-sm toggle-primary" />
          Hide Grok
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="chat" class="toggle toggle-sm toggle-primary" />
          Hide Chat
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="who-to-follow" class="toggle toggle-sm toggle-primary" />
          Hide Who to follow
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="happening" class="toggle toggle-sm toggle-primary" />
          Hide What’s happening
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="premium" class="toggle toggle-sm toggle-primary" />
          Hide Premium Offer
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Home Page</legend>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="feed" class="toggle toggle-sm toggle-primary" />
          Hide Feed
        </label>
      </fieldset>

      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border px-6 py-2 text-sm">
        <legend class="fieldset-legend">Sidebar</legend>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="explore" class="toggle toggle-sm toggle-primary" />
          Hide Explore
        </label>
        <label class="label flex-row-reverse justify-between">
          <input type="checkbox" id="notifications" class="toggle toggle-sm toggle-primary" />
          Hide Notifications
        </label>
        <label class="label mb-1.5 flex-row-reverse justify-between">
          <input type="checkbox" id="follow" class="toggle toggle-sm toggle-primary" />
          Hide Follow
        </label>
      </fieldset>
  `;

  const options = document.querySelectorAll(".toggle");
  options.forEach((option) => {
    option.addEventListener("change", (e) => saveOption(e.target.id, "x"));
  });

  loadOptions("x");
}
