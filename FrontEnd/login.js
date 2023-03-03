const user = document.getElementById("email");
const pass = document.getElementById("password");
const log = document.querySelector("input[type='submit']");
const form = document.getElementById("connexion");
let result = {};
let token = "";
let tokenDate = "";
let connectedAlert = "";

form.addEventListener("submit", (e) => {
  if (user.value.length < 5 || pass.value.length < 5) {
    e.preventDefault();
    alert("Veuillez remplir correctement le formulaire");
  } else {
    //Nécessaire???????????????????????????????????
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
      Authorization: "Bearer ${token}",
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: chargeUtil,
  });
  let result = await response.json();

  if (result.message == "user not found") {
    alert("Les informations de connexion sont erronées");
  } else if (result.error) {
    alert("Mot de passe incorrect");
  } else {
    token = result.token;
    // window.sessionStorage.setItem("connected", token);
    tokenDate = Date.parse(new Date());
    // window.sessionStorage.setItem("connectedTime", tokenDate);
    connectedAlert = true;
    // window.sessionStorage.setItem("connectedAlert", connectedAlert);
    createCookie("connected", "True", 1, token);
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
