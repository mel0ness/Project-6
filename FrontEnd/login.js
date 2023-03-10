const user = document.getElementById("email");
const pass = document.getElementById("password");
const log = document.querySelector("input[type='submit']");
const form = document.getElementById("connexion");
let result = {};
let token = "";
let tokenDate = "";
let connectedAlert = "";

// Préparation choix cookie ou sessionStorage
const flyingCookie = document.getElementById("flyingcookie");
const accept = document.getElementById("accept");
const deny = document.getElementById("deny");
let cookiez = null;

const selectSessionMode = () => {
  accept.addEventListener("click", () => {
    flyingCookie.classList.add("flyingcookieEscape");
    cookiez = true;
  });
  deny.addEventListener("click", () => {
    flyingCookie.classList.add("flyingcookieEscape");
    cookiez = false;
  });
};

selectSessionMode();

// Submit final

form.addEventListener("submit", (e) => {
  const Warning = document.getElementById("indicationsRed");
  if (user.value.length < 5 || pass.value.length < 5) {
    e.preventDefault();
    Warning.classList.remove("majax");
    Warning.textContent = "Veuillez remplir correctement le formulaire";
  } else {
    e.preventDefault();
    verif();
  }
});

async function verif() {
  const login = {
    email: user.value,
    password: pass.value,
  };

  const chargeUtil = JSON.stringify(login);
  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: chargeUtil,
  });
  let result = await response.json();
  const Warning = document.getElementById("indicationsRed");

  if (result.message == "user not found") {
    Warning.classList.remove("majax");
    Warning.textContent = "Les informations de connexion sont erronées";
  } else if (result.error) {
    Warning.classList.remove("majax");
    Warning.textContent = "Mot de passe incorrect";
  } else {
    token = result.token;
    Warning.classList.add("majax");
    if (cookiez == true) {
      createCookie("connected", "True", 1, token);
    } else if (cookiez == false) {
      window.sessionStorage.setItem("connected", token);
      tokenDate = Date.parse(new Date());
      window.sessionStorage.setItem("connectedTime", tokenDate);
      connectedAlert = true;
      window.sessionStorage.setItem("connectedAlert", connectedAlert);
    }

    document.location.href = "./index.html";
  }
}

const createCookie = (name, value, days, token) => {
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "";
    expires = "" + date.toISOString();
    document.cookie =
      name + " = " + value + " " + expires + " " + token + "; path=/";
  } else {
    let expires = "";
    document.cookie = name + " = " + value + " " + expires + "; path=/";
  }
};
