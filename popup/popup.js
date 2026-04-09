const powerSwitchEl = document.querySelector("#power-switch");
const pageContentEl = document.querySelector("#page-content");

let sld;
const supportedWebsites = {
  youtube: loadYouTubeContent(),
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs && !tabs[0]) return;

  // Extract the second-level domain from the URL
  const url = new URL(tabs[0].url);
  const hostname = url.hostname;
  const hostnameParts = hostname.split(".");
  sld = hostnameParts.length == 2 ? hostnameParts[0] : hostnameParts[1];

  sld in supportedWebsites ? supportedWebsites.sld : displayAlert();
});

// Load power switch condition from local storage
chrome.storage.local.get(["power"], (condition) => {
  const c = condition.power || "on";

  if (c === "off") powerSwitchEl.checked = false;
});

// Save power switch condition to local storage
powerSwitchEl.addEventListener("change", () => {
  powerSwitchEl.checked ? chrome.storage.local.set({ power: "on" }) : chrome.storage.local.set({ power: "off" });
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
          <input type="checkbox" id="autoplay" class="toggle toggle-sm toggle-primary" />
          Disable Autoplay
        </label>
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
