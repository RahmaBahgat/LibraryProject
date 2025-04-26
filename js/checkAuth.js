function check(allowed) {
  if (localStorage.getItem("loggedIn")) {
    if (JSON.parse(localStorage.getItem("loggedIn")).email == "admin") {
      return;
    }
  } else {
    if (!allowed) {
      window.location.replace("LogIn_SignUp page.html");
    }
  }
}

function loginCheck() {
  if (localStorage.getItem("loggedIn")) {
    if (JSON.parse(localStorage.getItem("loggedIn")).email == "admin") {
      return;
    } else {
      if (window.location.pathname.includes("html/")) {
        window.location.replace("HomePage-user.html");
      } else {
        window.location.replace("html/HomePage-user.html");
      }
    }
  }
}
