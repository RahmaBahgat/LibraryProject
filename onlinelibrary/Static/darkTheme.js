const theme_btn = document.getElementById("theme");
theme_btn.addEventListener("click", changeTheme);

function changeTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");
  theme_btn.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const root = document.documentElement;
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
    theme_btn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }
}

document.addEventListener("DOMContentLoaded", initTheme);
