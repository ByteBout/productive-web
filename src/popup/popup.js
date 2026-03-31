const powerSwitchEl = document.querySelector("#power-switch");
const pageContentEl = document.querySelector("#page-content");

let sld;
const supportedWebsites = {
  youtube: "",
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs && !tabs[0]) return;

  // Extract the second-level domain from the URL
  const url = new URL(tabs[0].url);
  const hostname = url.hostname;
  const hostnameParts = hostname.split(".");
  sld = hostnameParts.length == 2 ? hostnameParts[0] : hostnameParts[1];

  displayAlert(sld);
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

function displayAlert(sld) {
  // Display an alert for unsupported websites and a list of supported websites
  if (!(sld in supportedWebsites)) {
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
}
