// Get API and able to use it is a var__________________________________

let dataBase = [];

async function fetchAPI() {
  const response = await fetch("http://localhost:5678/api/works");
  dataBase = await response.json();
  console.log(dataBase);
  createElements(dataBase);
}

fetchAPI();

// Async function but scope probs! Better in module or call function each time? ++ module doesn't accept to define variables??? ________________
//Choix difficile = > Module est parfait pour avoir notre élément défini dans tout le document alors que le async/await ne le défini que dans un scope précis
// = > non-module permet de définir nos variables dans tous le document et d'utiliser le JS en pleine capacité.
//Séparation des js modules et classiques?

// const response = await fetch("http://localhost:5678/api/works");
// dataBase = await response.json();

// console.log(dataBase);

// Some test ________________________________________________________

// console.log(array[7]);

// array.splice(3, 4);
// console.log(array);

//Création des éléments en dynamique ______________________________________________________

function createElements(e) {
  for (let i = 0; i < e.length; i++) {
    const figure = e[i];
    const img = document.createElement("figure");
    img.innerHTML = `<img src=${figure.imageUrl} alt=${figure.title}>
<figcaption>${figure.title}</figcaption>`;

    const galerie = document.querySelector(".gallery");
    galerie.appendChild(img);
  }
}

const elem = document.getElementById("contact");
