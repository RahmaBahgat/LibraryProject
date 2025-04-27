// Regex Constraints
const nameRegex = /^[A-Za-z\s'-]{2,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const FnameInput = document.getElementById("first-name");
FnameInput.addEventListener("blur", () => {
  manageAlert(FnameInput, "Fname-alert", nameRegex);
});

const LnameInput = document.getElementById("last-name");
LnameInput.addEventListener("blur", () => {
  manageAlert(LnameInput, "Lname-alert", nameRegex);
});

const emailInput = document.getElementById("newEmail");
emailInput.addEventListener("blur", () => {
  manageAlert(emailInput, "email-alert", emailRegex);
});

const logInEmailInput = document.getElementById("email");
logInEmailInput.addEventListener("blur", () => {
  manageAlert(logInEmailInput, "login-email-alert", emailRegex);
});

const passwordInput = document.getElementById("signup-password");
passwordInput.addEventListener("blur", () => {
  manageAlert(passwordInput, "password-alert", passwordRegex);
});

const logInPasswordInput = document.getElementById("signin-password");
logInPasswordInput.addEventListener("blur", () => {
  manageAlert(logInPasswordInput, "login-password-alert", "empty");
});

const rePasswordInput = document.getElementById("confirm-password");
rePasswordInput.addEventListener("blur", () => {
  manageAlert(rePasswordInput, "rePassword-alert", "match");
});

let users = JSON.parse(localStorage.getItem("users")) || [];
const createBtn = document.getElementById("create-btn");
const loginBtn = document.getElementById("login-btn");

createBtn.addEventListener("click", () => {
  if (
    manageAlert(FnameInput, "Fname-alert", nameRegex) &
    manageAlert(LnameInput, "Lname-alert", nameRegex) &
    manageAlert(emailInput, "email-alert", emailRegex) &
    manageAlert(passwordInput, "password-alert", passwordRegex) &
    manageAlert(rePasswordInput, "rePassword-alert", "match")
  ) {
    if (checkEmail(emailInput)) {
      console.log("Account Created");
      signUp();
    }
  } else {
    console.log("Not created");
  }
});

loginBtn.addEventListener("click", () => {
  if (logInEmailInput.value == "admin" && logInPasswordInput.value == "admin") {
    logIn(logInEmailInput.value, logInPasswordInput.value);
  }
  if (
    manageAlert(logInEmailInput, "login-email-alert", emailRegex) &
    manageAlert(logInPasswordInput, "login-password-alert", "empty")
  ) {
    if (checkPassword(logInEmailInput.value, logInPasswordInput.value)) {
      logIn(logInEmailInput.value, logInPasswordInput.value);
    }
  }
});

// Functions
function signUp() {
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let email = document.getElementById("newEmail").value;
  let password = document.getElementById("signup-password").value;
  let isAdmin = document.getElementById("signup-option1").checked;

  let newUser = {
    firstName,
    lastName,
    email,
    password,
    authLevel: isAdmin ? 1 : 0,
    preferences: {
      keepLogin: true,
      profilePic: "",
    },
    books: {
      borrowed: [],
      favorite: [],
    },
  };

  let users = JSON.parse(localStorage.getItem("users"));
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedIn", JSON.stringify(newUser));

  if (isAdmin) {
    window.location.replace("HomePage-admin.html");
  } else {
    window.location.replace("HomePage-user.html");
  }
}

function checkEmail(inputID) {
  let users = JSON.parse(localStorage.getItem("users"));

  if (users.find((u) => u.email === inputID.value)) {
    manageAlert(inputID, "email-alert", "emailFound");

    console.log("email found");
    return;
  }
  console.log("email not found");
  return true;
}

function checkPassword(email, password) {
  let users = JSON.parse(localStorage.getItem("users"));
  const user = users.find((u) => u.email === email);

  if (user) {
    if (user.password === password) {
      console.log("Account verified");
      return true;
    } else {
      console.log("Password incorrect");
      manageAlert(logInPasswordInput, "login-password-alert", "loginMatch");
      return false;
    }
  } else {
    console.log("user doesn't exist");
    manageAlert(logInEmailInput, "login-email-alert", "notUser");
    return false;
  }
}

function logIn(email) {
  let users = JSON.parse(localStorage.getItem("users"));
  const user = users.find((u) => u.email === email);
  const keepLogin = document.getElementById("keep-login").checked;

  user.preferences.keepLogin = keepLogin;

  localStorage.setItem("loggedIn", JSON.stringify(user));

  if (user.authLevel > 0) {
    window.location.replace("HomePage-admin.html");
  } else {
    window.location.replace("HomePage-user.html");
  }
}

function manageAlert(inputID, alertID, regex) {
  const alert = document.getElementById(alertID);
  let condition = null;

  if (regex == "match") {
    condition = inputID.value != passwordInput.value;
  } else if (regex == "emailFound" && inputID == emailInput) {
    alert.innerHTML = "Email Already Exists";
    condition = true;
  } else if (regex == "loginMatch") {
    alert.innerHTML = "Password is Incorrect";
    condition = true;
  } else if (regex == "notUser") {
    alert.innerHTML = "User doesn't Exist";
    condition = true;
  } else if (regex == "empty") {
    alert.innerHTML = "Field can't be Empty";
    condition = !inputID.value;
  } else {
    if (inputID == emailInput) {
      alert.innerHTML = "Email must consist of @ and . at the end";
    }
    condition = !regex.test(inputID.value);
  }

  if (condition) {
    alert.classList.add("show");
    alert.classList.remove("hide");
  } else {
    alert.classList.add("hide");
    alert.classList.remove("show");
    return true;
  }
}

function updateUser(userData, email) {
  const users = JSON.parse(localStorage.getItem("users"));
  let index = users.findIndex((u) => u.email === email);

  if (index !== -1) {
    users[index] = userData;
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    console.log("User not found.");
  }
}
