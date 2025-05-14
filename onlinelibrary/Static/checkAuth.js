const userData = JSON.parse(localStorage.getItem("loggedIn"));

if (localStorage.getItem("users") == null) {
  let users = [
    {
      firstName: "admin",
      lastName: "admin",
      email: "admin",
      password: "admin",
      authLevel: "1",
      preferences: {
        keepLogin: true,
        profilePic: "",
      },
      books: {
        borrowed: [],
        favorite: [],
      },
    },
  ];
  localStorage.setItem("users", JSON.stringify(users));
  console.log("(users) array created");
}

function check(allowed, level) {
  if (localStorage.getItem("loggedIn")) {
    const userData = JSON.parse(localStorage.getItem("loggedIn"));
    // return userData.authLevel;

    if (userData.authLevel >= level) {
      return;
    } else {
      window.location.replace("HomePage-user.html");
    }
  } else {
    if (!allowed) {
      window.location.replace("LogIn_SignUp page.html");
    }
  }
}

function loginCheck() {
  if (localStorage.getItem("loggedIn")) {
    if (userData.authLevel > 0) {
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
