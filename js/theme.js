const themeButton = document.getElementById("theme-toggle");
const html = document.querySelector("html");

/** On Init */
(function init() {

  themeButton.addEventListener("click", toggleTheme);
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
  }
  /** Set icon theme */
  changeThemeButtonIcon();

})();

/**
 * Change Theme
 */
function toggleTheme() {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    themeButton.innerText = "Enable"
  } else {
    localStorage.setItem("theme", "dark");
    themeButton.innerText = "Disable"
  }
  html.classList.toggle("dark");
  changeThemeButtonIcon();
}

/**
 * Change Theme Button Icon
 */
function changeThemeButtonIcon() {
  if (localStorage.getItem("theme") === "dark") {
    themeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    `
  } else {
    themeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    `
  }
}