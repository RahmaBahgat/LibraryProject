const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");
let isPasswordVisible = false;

var overlay = document.getElementById("overlay");

// The sidebars
var leftText = document.getElementById("sign-in");
var rightText = document.getElementById("sign-up");

// The forms
var accountForm = document.getElementById("sign-in-info");
var signinForm = document.getElementById("sign-up-info");

// Add event listeners for the slide buttons
document.getElementById("slide-right-button").addEventListener("click", openSignIn);
document.getElementById("slide-left-button").addEventListener("click", openSignUp);

// Open the Sign Up page
function openSignUp() {
  // Remove classes so that animations can restart on the next 'switch'
  leftText.classList.remove("overlay-text-left-animation-out");
  overlay.classList.remove("open-sign-in");
  rightText.classList.remove("overlay-text-right-animation");
  // Add classes for animations
  accountForm.className += " form-left-slide-out";
  rightText.className += " overlay-text-right-animation-out";
  overlay.className += " open-sign-up";
  leftText.className += " overlay-text-left-animation";
  // hide the sign up form once it is out of view
  setTimeout(function () {
    accountForm.classList.remove("form-left-slide-in");
    accountForm.style.display = "none";
    accountForm.classList.remove("form-left-slide-out");
  }, 700);
  // display the sign in form once the overlay begins moving right
  setTimeout(function () {
    signinForm.style.display = "flex";
    signinForm.classList += " form-right-slide-in";
  }, 200);
}

// Open the Sign In page
function openSignIn() {
  // Remove classes so that animations can restart on the next 'switch'
  leftText.classList.remove("overlay-text-left-animation");
  overlay.classList.remove("open-sign-up");
  rightText.classList.remove("overlay-text-right-animation-out");
  // Add classes for animations
  signinForm.classList += " form-right-slide-out";
  leftText.className += " overlay-text-left-animation-out";
  overlay.className += " open-sign-in";
  rightText.className += " overlay-text-right-animation";
  // hide the sign in form once it is out of view
  setTimeout(function () {
    signinForm.classList.remove("form-right-slide-in");
    signinForm.style.display = "none";
    signinForm.classList.remove("form-right-slide-out");
  }, 700);
  // display the sign up form once the overlay begins moving left
  setTimeout(function () {
    accountForm.style.display = "flex";
    accountForm.classList += " form-left-slide-in";
  }, 200);
}

document.querySelectorAll(".toggle-eye").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.dataset.target;
    const passwordField = document.getElementById(targetId);
    const icon = toggle.querySelector("i");
    const isPasswordVisible = passwordField.type === "password";

    passwordField.type = isPasswordVisible ? "text" : "password";
    icon.classList.toggle("fa-eye", !isPasswordVisible);
    icon.classList.toggle("fa-eye-slash", isPasswordVisible);
  });
});

document.querySelectorAll(".filter-switch").forEach((toggle) => {
  const inputs = toggle.querySelectorAll("input");
  const background = toggle.querySelector(".background");

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.id.includes("option2")) {
        background.style.left = "50%";
      } else {
        background.style.left = "0";
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);

      const response = await fetch(loginForm.action, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      });

      const data = await response.json();
      const errorContainer = document.getElementById("login-error-container");
      errorContainer.innerHTML = "";

      if (data.success) {
        window.location.href = data.redirect_url;
      } else {
        data.errors.forEach((err) => {
          const p = document.createElement("p");
          p.classList.add("error-message");
          p.textContent = err;
          errorContainer.appendChild(p);
        });
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);

      const response = await fetch(signupForm.action, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      });

      const data = await response.json();
      const errorContainer = document.getElementById("signup-error-container");
      errorContainer.innerHTML = "";

      if (data.success) {
        window.location.href = data.redirect_url;
      } else {
        data.errors.forEach((err) => {
          const p = document.createElement("p");
          p.classList.add("error-message");
          p.textContent = err;
          errorContainer.appendChild(p);
        });
      }
    });
  }
});
