function check(allowed) {
  if (JSON.parse(localStorage.getItem("loggedIn")).email == "admin") {
    return;
  }

  if (localStorage.getItem("loggedIn") == null) {
    if (!allowed) {
      window.location.replace("LogIn_SignUp page.html");
    }
  }
}

function loginCheck() {
  if (JSON.parse(localStorage.getItem("loggedIn")).email == "admin") {
    return;
  }

  if (localStorage.getItem("loggedIn") != null) {
    if (window.location.pathname.includes("html/")) {
      window.location.replace("HomePage-user.html");
    } else {
      window.location.replace("html/HomePage-user.html");
    }
  }
}
