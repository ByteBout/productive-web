const lightIconEl = document.querySelector("#light-icon");
const darkIconEl = document.querySelector("#dark-icon");

// Detect the user's device theme
const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (isDarkMode) {
  darkIconEl.classList.toggle("hidden");
} else {
  lightIconEl.classList.toggle("hidden");
}
