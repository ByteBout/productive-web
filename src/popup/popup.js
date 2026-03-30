const powerSwitchEl = document.querySelector("#power-switch");

// Load power switch condition from local storage
chrome.storage.local.get(["power"], (condition) => {
  const c = condition.power || "on";

  if (c === "off") powerSwitchEl.checked = false;
});

// Save power switch condition to local storage
powerSwitchEl.addEventListener("change", () => {
  powerSwitchEl.checked ? chrome.storage.local.set({ power: "on" }) : chrome.storage.local.set({ power: "off" });
});
