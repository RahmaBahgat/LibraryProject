const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

document.addEventListener("DOMContentLoaded", () => {
  // Get all necessary elements
  const overlay = document.getElementById("overlay");
  const leftText = document.getElementById("sign-in");
  const rightText = document.getElementById("sign-up");
  const accountForm = document.getElementById("sign-in-info");
  const signinForm = document.getElementById("sign-up-info");
  const slideRightButton = document.getElementById("slide-right-button");
  const slideLeftButton = document.getElementById("slide-left-button");

  // Set initial form states - both forms visible without transitions
  if (signinForm) signinForm.style.display = "flex";
  if (accountForm) accountForm.style.display = "flex";

  // Open the Sign Up page
  function openSignUp(e) {
    if (e) e.preventDefault();
    
    // Remove animation classes
    leftText.classList.remove("overlay-text-left-animation-out");
    overlay.classList.remove("open-sign-in");
    rightText.classList.remove("overlay-text-right-animation");
    
    // Add animation classes
    accountForm.classList.add("form-left-slide-out");
    rightText.classList.add("overlay-text-right-animation-out");
    overlay.classList.add("open-sign-up");
    leftText.classList.add("overlay-text-left-animation");
    
    // Handle form transitions
    setTimeout(() => {
      accountForm.classList.remove("form-left-slide-in");
      accountForm.style.display = "none";
      accountForm.classList.remove("form-left-slide-out");
    }, 700);
    
    setTimeout(() => {
      signinForm.style.display = "flex";
      signinForm.classList.add("form-right-slide-in");
    }, 200);
  }

  // Open the Sign In page
  function openSignIn(e) {
    if (e) e.preventDefault();
    
    // Remove animation classes
    leftText.classList.remove("overlay-text-left-animation");
    overlay.classList.remove("open-sign-up");
    rightText.classList.remove("overlay-text-right-animation-out");
    
    // Add animation classes
    signinForm.classList.add("form-right-slide-out");
    leftText.classList.add("overlay-text-left-animation-out");
    overlay.classList.add("open-sign-in");
    rightText.classList.add("overlay-text-right-animation");
    
    // Handle form transitions
    setTimeout(() => {
      signinForm.classList.remove("form-right-slide-in");
      signinForm.style.display = "none";
      signinForm.classList.remove("form-right-slide-out");
    }, 700);
    
    setTimeout(() => {
      accountForm.style.display = "flex";
      accountForm.classList.add("form-left-slide-in");
    }, 200);
  }

  // Add click event listeners to the slide buttons
  if (slideRightButton) {
    slideRightButton.addEventListener("click", openSignIn);
  }
  if (slideLeftButton) {
    slideLeftButton.addEventListener("click", openSignUp);
  }

  // Password toggle functionality
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

  // Filter switch functionality
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

  // Get CSRF token from cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Handle form submission
  async function handleFormSubmit(form, errorContainer) {
    try {
      errorContainer.innerHTML = "";
      const formData = new FormData(form);
      const csrftoken = getCookie('csrftoken');
      
      if (!csrftoken) {
        throw new Error('CSRF token not found. Please refresh the page.');
      }

      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrftoken,
        },
        body: formData,
        credentials: 'same-origin'
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (response.ok && data.success) {
        if (data.message) {
          const successMsg = document.createElement('p');
          successMsg.classList.add('success-message');
          successMsg.textContent = data.message;
          errorContainer.appendChild(successMsg);
        }

        setTimeout(() => {
          window.location.href = data.redirect_url;
        }, 500);
      } else {
        const errors = data.errors || ['An error occurred. Please try again.'];
        errors.forEach(error => {
          const errorMsg = document.createElement('p');
          errorMsg.classList.add('error-message');
          errorMsg.textContent = error;
          errorContainer.appendChild(errorMsg);
        });
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = document.createElement('p');
      errorMsg.classList.add('error-message');
      errorMsg.textContent = error.message || 'An error occurred. Please try again.';
      errorContainer.appendChild(errorMsg);
    }
  }

  // Add form submit handlers
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorContainer = document.getElementById('login-error-container');
      await handleFormSubmit(loginForm, errorContainer);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorContainer = document.getElementById('signup-error-container');
      await handleFormSubmit(signupForm, errorContainer);
    });
  }
});
