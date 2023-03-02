//Solution de rechange en attendant! Comment vérifier le token à chaque chargement? Perdu je suis...
// Window.localeStorage sur Firefox offline???
let connectedTime = parseInt(window.localStorage.getItem("connectedTime"));
let connected = window.localStorage.getItem("connected");
let date = Date.parse(new Date());
let connectedSecurity = connectedTime + 3600000;
let connectedAlert = window.localStorage.getItem("connectedAlert");
const body = document.querySelector("body");

const disconnect = () => {
  window.localStorage.clear();
  connected = null;
  connectedTime = null;
  window.location.reload();
};

//Modale_______________________________________________________________________________
//Elements sur le body ne fonctionnent pas au niveau du click????
const modale = () => {
  const modaleFiltre = document.getElementById("modale");
  const modaleDiv = document.getElementById("modale-item");
  modaleDiv.innerHTML = `
      <div class="cross" id="cross">
        <div class="cross-elem cross-left"></div>
        <div class="cross-elem cross-right"></div>
      </div>
      <div class="modale-galerie">
        <h3>Galerie photo</h3>
        <div class="galerie-dyn" id="galerie-dyn">

        </div>
        <div class="line"></div>
        <input type="submit" value="Ajouter une photo">
        <p class="delete">Supprimer la galerie</p>
      </div>
  `;
  modaleFiltre.classList.add("modale-class_visible");
  // const modaleItem = document.getElementById("modale-item");

  const galerieDyn = document.getElementById("galerie-dyn");
  createElementsGalerie(dataBase, galerieDyn);
  const cross = document.getElementById("cross");
  cross.addEventListener("click", () => {
    modaleDiv.innerHTML = "";
    modaleFiltre.classList.remove("modale-class_visible");
  });
  modaleFiltre.addEventListener("click", () => {
    modaleDiv.innerHTML = "";
    modaleFiltre.classList.remove("modale-class_visible");
  });
};

// const modale = () => {
//   body.innerHTML += `<div class="modale-item" id="modale-item">
//       <div class="cross" id="cross">
//         <div class="cross-elem cross-left"></div>
//         <div class="cross-elem cross-right"></div>
//       </div>
//       <div class="modale-galerie">
//         <h3>Galerie photo</h3>
//         <div class="galerie-dyn" id="galerie-dyn">

//         </div>
//         <div class="line"></div>
//         <input type="submit" value="Ajouter une photo">
//         <p class="delete">Supprimer la galerie</p>
//       </div>
//     </div>
//     <div class="modale" id="modale"></div>`;
//   const modaleItem = document.getElementById("modale-item");
//   const modaleFiltre = document.getElementById("modale");
//   modaleFiltre.classList.add("modale-class_visible");
//   const galerieDyn = document.getElementById("galerie-dyn");
//   createElementsGalerie(dataBase, galerieDyn);
//   const cross = document.getElementById("cross");
//   cross.addEventListener("click", () => {
//     deleting(modaleItem, modaleFiltre);
//   });
//   modaleFiltre.addEventListener("click", () => {
//     deleting(modaleItem, modaleFiltre);
//   });
// };

// const deleting = (e, f) => {
//   e.remove();
//   f.remove();
// };

const createElementsGalerie = (e, f) => {
  for (let i = 0; i < e.length; i++) {
    const item = e[i];
    const img = document.createElement("div");
    img.classList.add("galerie-dyn_item");
    img.innerHTML = `<img src=${item.imageUrl} alt=${item.title}>
    <p>éditer</p>
`;

    f.appendChild(img);
  }
};

//Locale storage_______________________________________________________________________________
if (connected) {
  if (date > connectedSecurity) {
    alert("vous devez vous reconnecter");
    disconnect();
  } else {
    const logout = document.getElementById("logout");
    logout.innerHTML = "Logout";

    const body = document.querySelector("body");
    const edition = document.querySelector(".modeEdition");
    const editionProj = document.querySelector(".editionProj");
    const modifs = document.getElementById("modif");

    body.classList.add("decal");
    edition.classList.add("modeEditionLog");
    editionProj.classList.add("editionProjLog");

    modifs.addEventListener("click", () => {
      modale();
    });

    logout.addEventListener("click", () => {
      disconnect();
    });

    if (connectedAlert) {
      alert("connecté");
      connectedAlert = null;
      window.localStorage.removeItem("connectedAlert");
    }
  }
}

// Get API and able to use it is a var__________________________________
const filtres = document.querySelectorAll(".filtres");
const galerie = document.querySelector(".gallery");
let dataBase = [];

async function fetchAPI() {
  galerie.innerHTML = "";
  const response = await fetch("http://localhost:5678/api/works");
  dataBase = await response.json();
  console.log(dataBase);
  createElements(dataBase);
}

fetchAPI();

// Async function but scope probs! Better in module or call function each time? ++ module doesn't accept to define variables??? ________________
//Choix difficile = > Module est parfait pour avoir notre élément défini dans tout le document alors que le async/await ne le défini que dans un scope précis (Réutilisation des fonctions dans le scope direct!!!)
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

    galerie.appendChild(img);
  }
}

//Event sur les filtres______________________________________________________________________

let filterGlobal = ["all", "Objets", "Appartements", "Hotels_&_restaurants"];
let filterMinus = [];
let dataBaseFiltres = [];

filtres.forEach((filtre) => {
  filtre.addEventListener("click", (e) => {
    filtrer(e.target.id);
    // switch (e.target.id) {
    //   case "all":
    //     filtrer(e.target.id);
    //     break;
    //   case "Objets":
    //     filtrer(e.target.id);
    //     break;
    //   case "Appartements":
    //     filtrer(e.target.id);
    //     break;
    //   case "Hotels_&_restaurants":
    //     filtrer(e.target.id);
    //     break;
    //   default:
    //     null;
    // }
  });
});

function filtrer(e) {
  filterMinusFunction(e.toString());
  const minusOne = document.getElementById(`${filterMinus[0]}`);
  const minusTwo = document.getElementById(`${filterMinus[1]}`);
  const minusThree = document.getElementById(`${filterMinus[2]}`);
  const element = document.getElementById(`${e}`);

  if (!element.classList.contains("filtres-selected")) {
    element.classList.add("filtres-selected");
    minusOne.classList.remove("filtres-selected");
    minusTwo.classList.remove("filtres-selected");
    minusThree.classList.remove("filtres-selected");

    if (e === "all") {
      filtresAll();
    } else if (e !== "all") {
      filtresFinaux(e);
    }
  }
}
const filterMinusFunction = (index) => {
  filterMinus = filterGlobal.filter((e) => {
    return !e.match(index);
  });
};

// Besoin de recharger une API? Doute dans ce cadre précis...

// const filtresFinaux = (e) => {
//   let components = e.toString();
//   components = components.replace("_", " ");
//   components = components.replace("_", " ");

//   async function fetchAPIFiltre() {
//     const response = await fetch("http://localhost:5678/api/works");
//     dataBase = await response.json();
//     dataBaseFiltres = dataBase.filter((d) => {
//       return d.category.name == components;
//     });
//     galerie.innerHTML = "";
//     createElements(dataBaseFiltres);
//   }
//   fetchAPIFiltre();
// };

// Sans chargement nouveau d'API

const filtresAll = () => {
  galerie.innerHTML = "";
  createElements(dataBase);
};

const filtresFinaux = (e) => {
  let components = e.toString();
  components = components.replace("_", " ");
  components = components.replace("_", " ");
  console.log(components);

  dataBaseFiltres = dataBase.filter((d) => {
    return d.category.name == components;
  });
  galerie.innerHTML = "";
  createElements(dataBaseFiltres);
};
