//Solution de rechange en attendant! Comment vérifier le token à chaque chargement? Perdu je suis...
// Window.localeStorage sur Firefox offline???
let connectedTime = parseInt(window.localStorage.getItem("connectedTime"));
let connected = window.localStorage.getItem("connected");
let date = Date.parse(new Date());
let connectedSecurity = connectedTime + 3600000;
let connectedAlert = window.localStorage.getItem("connectedAlert");
const body = document.querySelector("body");
let newDataBaseFiltre = null;
let newDataBase = [];

const disconnect = () => {
  window.localStorage.clear();
  connected = null;
  connectedTime = null;
  window.location.reload();
};

//Modale_______________________________________________________________________________

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
        <input type="submit" value="Ajouter une photo" id="ajouter-click">
        <p class="delete">Supprimer la galerie</p>
      </div>
  `;
  modaleFiltre.classList.add("modale-class_visible");
  // const modaleItem = document.getElementById("modale-item");

  const galerieDyn = document.getElementById("galerie-dyn");
  if (dataBaseFiltres === null) {
    createElementsGalerie(newDataBase, galerieDyn);
  } else {
    createElementsGalerie(newDataBaseFiltre, galerieDyn);
  }
  const cross = document.getElementById("cross");
  cross.addEventListener("click", () => {
    fermeture(modaleDiv, modaleFiltre);
  });

  modaleFiltre.addEventListener("click", () => {
    fermeture(modaleDiv, modaleFiltre);
  });
  const ajout = document.getElementById("ajouter-click");
  ajout.addEventListener("click", () => {
    modaleAjout();
  });
};

const fermeture = (e, f) => {
  e.innerHTML = "";
  f.classList.remove("modale-class_visible");
  galerie.innerHTML = "";
  if (newDataBaseFiltre) {
    createElements(newDataBaseFiltre);
  } else {
    createElements(newDataBase);
  }
};

const modaleAjout = () => {
  const modaleFiltre = document.getElementById("modale");
  const modaleDiv = document.getElementById("modale-item");
  modaleDiv.innerHTML = `
  <img src="./assets/icons/Arrow_Back.png" alt="flêche de retour"
  id="back" class="back">
<div class="cross" id="cross">
  <div class="cross-elem cross-left"></div>
  <div class="cross-elem cross-right"></div>
</div>
<div class="modale-ajout">
  <h3>Ajout photo</h3>

  <form action="#" method="post"></form>
  <div class="ajout-photo">
    <div class="image-click"><img src="./assets/icons/mountains.png" alt="mountains"
        class="mountains"><img src="./assets/icons/sun.png" alt="sun" class="sun"></div>
    <div class="click-ajout">+ Ajouter photo</div>
    <div class="indications">jpg, png : 4mo max</div>
  </div>
  <label for="titre">Titre</label>
  <input id="titre" name="titre" type="text">
  <label for="categorie">Catégorie</label>
  <select name="categorie" id="categorie">
    <option value=""></option>
    <option value="Objets">Objets</option>
    <option value="Appartements">Appartements</option>
    <option value="Hotels & restaurants">Hotels & restaurants</option>

  </select>
  <div class="line"></div>
  <input type="submit" value="Valider" class="inactive">
  </form> 
</div>`;

  const cross = document.getElementById("cross");
  cross.addEventListener("click", () => {
    modaleDiv.innerHTML = "";
    modaleFiltre.classList.remove("modale-class_visible");
  });

  const back = document.getElementById("back");
  back.addEventListener("click", () => {
    modaleDiv.innerHTML = "";
    modale();
  });
};

const createElementsGalerie = (e, f) => {
  for (let i = 0; i < e.length; i++) {
    const item = e[i];
    const img = document.createElement("div");
    img.classList.add("galerie-dyn_item");
    img.id = `id${parseInt(i) + 1}`;
    img.innerHTML = `<img src=${item.imageUrl} alt=${item.title} class="img-dyn">	<div class="logo-black" id="super${img.id}"><img src="./assets/icons/bin.svg" alt="bin"></div>
    <p>éditer</p>
`;

    f.appendChild(img);
    const numberOne = document.getElementById("id1");
    numberOne.innerHTML += `<div class="logo-black2"><img src="./assets/icons/multicross.svg" alt="multicross"></div>`;
  }
  const galerieDyn = document.getElementById("galerie-dyn");

  const deleteImg = document.querySelectorAll(".logo-black");

  deleteImg.forEach((e) => {
    e.addEventListener("click", () => {
      let superId = e.id;
      let finalId = Number(superId.slice(7)) - 1;
      console.log(finalId);
      if (dataBaseFiltres) {
        newDataBaseFiltre.splice(finalId, 1);
        f.innerHTML = "";
        if (dataBaseFiltres[0].category.name == "Objets") {
          filtresObjets = newDataBaseFiltre;
          newDataBase = newDataBase.filter((e) => {
            return e.category.name !== "Objets";
          });
          newDataBase.push(...filtresObjets);
          filtresGlobaux = newDataBase;
        } else if (dataBaseFiltres[0].category.name == "Appartements") {
          filtresAppartements = newDataBaseFiltre;
          newDataBase = newDataBase.filter((e) => {
            return e.category.name !== "Appartements";
          });
          newDataBase.push(...filtresAppartements);
          filtresGlobaux = newDataBase;
        } else {
          filtresHotels = newDataBaseFiltre;
          newDataBase = newDataBase.filter((e) => {
            return e.category.name !== "Hotels & restaurants";
          });
          newDataBase.push(...filtresHotels);
          filtresGlobaux = newDataBase;
        }

        createElementsGalerie(newDataBaseFiltre, galerieDyn);
      } else {
        newDataBase.splice(finalId, 1);
        f.innerHTML = "";
        filtresGlobaux = newDataBase;
        createElementsGalerie(newDataBase, galerieDyn);
      }
    });
  });
};

//Locale storage_______________________________________________________________________________
if (connected) {
  if (date > connectedSecurity) {
    alert("vous devez vous reconnecter");
    disconnect();
  } else {
    const logout = document.getElementById("logout");
    logout.innerHTML = "Logout";

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
  newDataBase = Array.from(dataBase);
  console.log(dataBase);
  createElements(dataBase);
}

fetchAPI();

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
let dataBaseFiltres = null;

filtres.forEach((filtre) => {
  filtre.addEventListener("click", (e) => {
    filtrer(e.target.id);
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

// Sans chargement nouveau d'API
let filtresGlobaux = null;

const filtresAll = () => {
  dataBaseFiltres = null;
  newDataBaseFiltre = null;

  if (filtresGlobaux == null) {
    filtresGlobaux = dataBase;
    galerie.innerHTML = "";
    createElements(filtresGlobaux);
  } else if (filtresGlobaux !== null) {
    galerie.innerHTML = "";
    createElements(filtresGlobaux);
  }
};

let filtresAppartements = null;
let filtresObjets = null;
let filtresHotels = null;

const filtresFinaux = (e) => {
  let components = e.toString();
  components = components.replace("_", " ");
  components = components.replace("_", " ");
  console.log(components);

  dataBaseFiltres = dataBase.filter((d) => {
    return d.category.name == components;
  });
  newDataBaseFiltre = dataBase.filter((d) => {
    return d.category.name == components;
  });

  if (components == "Appartements" && filtresAppartements == null) {
    filtresAppartements = dataBaseFiltres;
    galerie.innerHTML = "";
    createElements(filtresAppartements);
  } else if (components == "Appartements" && filtresAppartements !== null) {
    galerie.innerHTML = "";
    createElements(filtresAppartements);
  } else if (components == "Objets" && filtresObjets == null) {
    filtresObjets = dataBaseFiltres;
    galerie.innerHTML = "";
    createElements(filtresObjets);
  } else if (components == "Objets" && filtresObjets !== null) {
    galerie.innerHTML = "";
    createElements(filtresObjets);
  } else if (components == "Hotels & restaurants" && filtresHotels == null) {
    filtresHotels = dataBaseFiltres;
    galerie.innerHTML = "";
    createElements(filtresHotels);
  } else if (components == "Hotels & restaurants" && filtresHotels !== null) {
    galerie.innerHTML = "";
    createElements(filtresHotels);
  }
};
