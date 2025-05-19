// const userData = JSON.parse(localStorage.getItem("loggedIn"));

// if (localStorage.getItem("users") == null) {
//   let users = [
//     {
//       firstName: "admin",
//       lastName: "admin",
//       email: "admin",
//       password: "admin",
//       authLevel: "1",
//       preferences: {
//         keepLogin: true,
//         profilePic: "",
//       },
//       books: {
//         borrowed: [],
//         favorite: [],
//       },
//     },
//   ];
//   localStorage.setItem("users", JSON.stringify(users));
//   console.log("(users) array created");
// }

// function check(allowed, level) {
//   if (localStorage.getItem("loggedIn")) {
//     const userData = JSON.parse(localStorage.getItem("loggedIn"));
//     // return userData.authLevel;

//     if (userData.authLevel >= level) {
//       return;
//     } else {
//       window.location.replace("HomePage-user.html");
//     }
//   } else {
//     if (!allowed) {
//       window.location.replace("LogIn_SignUp page.html");
//     }
//   }
// }

// Function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Function to check authentication status and redirect if needed
async function loginCheck() {
  try {
    const response = await fetch("/check-auth/", {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "same-origin",
    });

    if (response.ok) {
      const data = await response.json();

      // If user is authenticated, redirect based on role
      if (data.is_authenticated) {
        if (data.is_superuser) {
          window.location.href = "/library-admin/books/";
        } else if (data.is_staff) {
          window.location.href = "/library-admin/books/";
        } else {
          window.location.href = "/home/";
        }
      }
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
}

// Export the function for use in other files
window.loginCheck = loginCheck;
