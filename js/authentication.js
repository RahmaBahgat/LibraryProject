// Regex Constraints
const nameRegex = /^[A-Za-z\s'-]{2,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

if (localStorage.getItem("users") == null) {
  let users = [
    {
      firstName: "mazen",
      lastName: "amr",
      email: "mazen@gmail.com",
      password: "abc123",
    },
  ];
  localStorage.setItem("users", JSON.stringify(users));
  console.log("(users) array created");
}

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

const passwordInput = document.getElementById("signup-password");
passwordInput.addEventListener("blur", () => {
  manageAlert(passwordInput, "password-alert", passwordRegex);
});

const rePasswordInput = document.getElementById("confirm-password");
rePasswordInput.addEventListener("blur", () => {
  manageAlert(rePasswordInput, "rePassword-alert", "match");
});

let users = JSON.parse(localStorage.getItem("users")) || [];
const createBtn = document.getElementById("create-btn");

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

// Functions
function signUp() {
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let email = document.getElementById("newEmail").value;
  let password = document.getElementById("signup-password").value;

  let newUser = {
    firstName,
    lastName,
    email,
    password,
  };

  let users = JSON.parse(localStorage.getItem("users"));
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
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

function manageAlert(inputID, alertID, regex) {
  const alert = document.getElementById(alertID);
  let condition = null;

  if (regex == "match") {
    condition = inputID.value != passwordInput.value;
  } else if (regex == "emailFound" && inputID == emailInput) {
    alert.innerHTML = "Email Already Exists";
    condition = true;
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
