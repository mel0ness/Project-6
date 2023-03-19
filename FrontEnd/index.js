//Solution de rechange en attendant! Comment vérifier le token à chaque chargement? Perdu je suis...
// Window.localeStorage sur Firefox offline???
let connectedTime = parseInt(window.sessionStorage.getItem("connectedTime"));
let connected = window.sessionStorage.getItem("connected");
let date = Date.parse(new Date());
let connectedSecurity = connectedTime + 7200000;
let connectedAlert = window.sessionStorage.getItem("connectedAlert");
const body = document.querySelector("body");
let newDataBaseFiltre = null;
let newDataBase = [];
let token = "";

// Cookie work_____________________________________________________________

let ca = document.cookie.split(";");
let caArrayCookie = Array.from(ca)
  .filter((e) => {
    return e.includes("connected=");
  })
  .toString();

// Deconnexion____________________________________________________________________

const disconnect = () => {
  eraseCookie("connected");
  window.sessionStorage.clear();
  connected = null;
  connectedTime = null;

  window.location.reload();
};

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=""';
  ca = Array.from(document.cookie.split(";"));
}

// Connection

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
        <p class="delete" id="supprimerGalerie">Supprimer la galerie</p>
      </div>
  `;
  modaleFiltre.classList.add("modale-class_visible");
  const deleteAllGalerie = document.getElementById("supprimerGalerie");
  deleteAllGalerie.addEventListener("click", () => {
    DeletingAll();
  });

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

const verifCo = () => {
  if (connected) {
    if (date > connectedSecurity) {
      alert("vous devez vous reconnecter");
      disconnect();
    } else {
      token = connected;
      connexionValider();
    }
  } else if (caArrayCookie.includes("connected=True")) {
    token = caArrayCookie.toString().split(" ").pop();
    connexionValider();
  }
};

const connexionValider = () => {
  const logout = document.getElementById("logout");
  logout.innerHTML = "Logout";

  const edition = document.querySelector(".modeEdition");
  const editionProj = document.querySelector(".editionProj");
  const modifs = document.getElementById("modif");
  const modifsHeader = document.getElementById("modifsHeader");

  body.classList.add("decal");
  edition.classList.add("modeEditionLog");
  editionProj.classList.add("editionProjLog");

  modifs.addEventListener("click", () => {
    modale();
  });

  modifsHeader.addEventListener("click", () => {
    modale();
  });

  logout.addEventListener("click", () => {
    disconnect();
  });
};

verifCo();
// Get API and able to use it is a var__________________________________
const filtres = document.querySelectorAll(".filtres");
const galerie = document.querySelector(".gallery");
let dataBase = [];

async function fetchAPI() {
  galerie.innerHTML = "";
  const response = await fetch("http://localhost:5678/api/works");
  dataBase = await response.json();
  newDataBase = Array.from(dataBase);
  createElements(dataBase);
}

fetchAPI();

//Création des éléments en dynamique ______________________________________________________

let filterIndex = null;

function createElements(e) {
  for (let i = 0; i < e.length; i++) {
    const figure = e[i];
    const img = document.createElement("figure");
    img.innerHTML = `<img src=${figure.imageUrl} alt=${figure.title}>
<figcaption>${figure.title}</figcaption>`;

    galerie.appendChild(img);
  }
}

let diffTotale = [];
let ErasingArray = [];

const DeletingAll = () => {
  const flyinDeleteGalerie = document.getElementById("flyinDeleteGalerie");
  flyinDeleteGalerie.classList.add("surprise");
  const acceptDeleteGalerie = document.getElementById("acceptDeleteGalerie");
  const denyDeleteGalerie = document.getElementById("denyDeleteGalerie");
  const galerieDyn = document.getElementById("galerie-dyn");

  acceptDeleteGalerie.addEventListener(
    "click",
    () => {
      if (newDataBaseFiltre) {
        if (dataBaseFiltres[0].categoryId == 1) {
          dataBaseFiltres = null;
          filtresObjets = dataBaseFiltres;
          modifInt(1);
          filtresGlobaux = newDataBase;
          diffTotale = dataBase.filter((x) => !newDataBase.includes(x));
          Eraser(diffTotale);
          Erasing(ErasingArray);
          galerieDyn.innerHTML = "";
          filterIndex = 1;
        } else if (dataBaseFiltres[0].categoryId == 2) {
          dataBaseFiltres = null;
          filtresAppartements = dataBaseFiltres;
          modifInt(2);
          filtresGlobaux = newDataBase;
          diffTotale = dataBase.filter((x) => !newDataBase.includes(x));
          Eraser(diffTotale);
          Erasing(ErasingArray);
          galerieDyn.innerHTML = "";
          filterIndex = 2;
        } else {
          dataBaseFiltres = null;
          filtresHotels = dataBaseFiltres;
          modifInt(3);
          filtresGlobaux = newDataBase;
          diffTotale = dataBase.filter((x) => !newDataBase.includes(x));
          Eraser(diffTotale);
          Erasing(ErasingArray);
          galerieDyn.innerHTML = "";
          filterIndex = 3;
        }
      } else {
        newDataBase = [];
        diffTotale = dataBase.filter((x) => !newDataBase.includes(x));
        Eraser(diffTotale);
        Erasing(ErasingArray);
        dataBase = [];
        galerieDyn.innerHTML = "";
      }
      flyinDeleteGalerie.classList.remove("surprise");
    },
    { once: true }
  );

  denyDeleteGalerie.addEventListener("click", () => {
    flyinDeleteGalerie.classList.remove("surprise");
  });
};

const Eraser = (e) => {
  let NumberToIterate = e.length;
  for (let i = 0; i < NumberToIterate; i++) {
    ErasingArray.push(diffTotale[0].id);
    diffTotale.shift();
  }
};

let xErasing = "";

const Erasing = (e) => {
  let NumberToIterate = e.length;
  for (let i = 0; i < NumberToIterate; i++) {
    async function EnvoieDeleteAll() {
      x = await ErasingArray.shift();
      await fetch(`http://localhost:5678/api/works/${x}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    EnvoieDeleteAll();
  }
};

const fermeture = (e, f) => {
  e.innerHTML = "";
  f.classList.remove("modale-class_visible");
  const deleteReally = document.getElementById("flyingcookie");
  if (deleteReally.classList.contains("surprise")) {
    deleteReally.classList.remove("surprise");
  }
  const flyinDeleteGalerie = document.getElementById("flyinDeleteGalerie");
  if (flyinDeleteGalerie.classList.contains("surprise")) {
    flyinDeleteGalerie.classList.remove("surprise");
  }
  galerie.innerHTML = "";
  if (newDataBaseFiltre) {
    if (dataBaseFiltres) {
      createElements(dataBaseFiltres);
    } else {
    }
  } else {
    createElements(newDataBase);
  }
};

let formulaireData = [];

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
<form action="" method="post" id="newPhoto" name="newPhoto">
<div class="modale-ajout">
  <h3>Ajout photo</h3>

 
  <div class="ajout-photo">
 
  <output class="majax" id="output"></output>
    <div class="image-click" id="imageClickable"><img src="./assets/icons/mountains.png" alt="mountains"
        class="mountains"><img src="./assets/icons/sun.png" alt="sun" class="sun"></div>
    <label class="click-ajout" id="inputFile" for="image"><div class="inlabel" id="inlabel">+ Ajouter photo</div><input type="file" accept="image/png, image/jpg, image/jpeg" id="image" name="image" ></input></label>
    <div class="indicationsRed majax" id="indicationsRed">Le fichier ne doit pas dépasser 4mo!</div>
    <div class="indications" id="indications">jpg, png : 4mo max</div>
  </div>
  <label for="title">Titre</label>
  <input id="title" name="title" type="text">
  <label for="category">Catégorie</label>
  <select name="category" id="category">
    <option value=""></option>
    <option value="1">Objets</option>
    <option value="2">Appartements</option>
    <option value="3">Hotels & restaurants</option>

  </select>
  <div class="line"></div>
  <input type="submit" value="Valider" class="inactiveOne inactiveTwo" disabled id="validationPhoto">
  <div class="indicationsRed2 majax" id="indicationsRed2">Tous les champs du formulaire doivent être remplis.</div>
  </form>
</div>`;

  innerCreateImg();

  formFunctionnal();
  validateAPI();
  const cross = document.getElementById("cross");
  cross.addEventListener("click", () => {
    fermeture(modaleDiv, modaleFiltre);
  });

  const back = document.getElementById("back");
  back.addEventListener("click", () => {
    modaleDiv.innerHTML = "";
    modale();
  });
};

const validateAPI = () => {
  const newPhoto = document.getElementById("newPhoto");
  newPhoto.addEventListener("submit", (e) => {
    e.preventDefault();

    formulaireData = new FormData(newPhoto);

    async function envoieAPI() {
      await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formulaireData,
      });
      async function fetchAPIAjout() {
        const response = await fetch("http://localhost:5678/api/works");
        dataBase = await response.json();
        newDataBase = Array.from(dataBase);
        filtresGlobaux = newDataBase;
        filtresObjets = dataBase.filter((d) => {
          return d.categoryId == 1;
        });
        filtresAppartements = dataBase.filter((d) => {
          return d.categoryId == 2;
        });
        filtresHotels = dataBase.filter((d) => {
          return d.categoryId == 3;
        });
        if (newDataBaseFiltre) {
          if (
            (dataBaseFiltres && dataBaseFiltres[0].categoryId == 1) ||
            filterIndex == 1
          ) {
            newDataBaseFiltre = filtresObjets;
            dataBaseFiltres = filtresObjets;
            filterIndex = null;
          }
          if (
            (dataBaseFiltres && dataBaseFiltres[0].categoryId == 2) ||
            filterIndex == 2
          ) {
            newDataBaseFiltre = filtresAppartements;
            dataBaseFiltres = filtresAppartements;
            filterIndex = null;
          }
          if (
            (dataBaseFiltres && dataBaseFiltres[0].categoryId == 3) ||
            filterIndex == 3
          ) {
            newDataBaseFiltre = filtresHotels;
            dataBaseFiltres = filtresHotels;
            filterIndex = null;
          }
        }
        modale();
        const galerieDyn = document.getElementById("galerie-dyn");
        galerieDyn.innerHTML = "";
        if (newDataBaseFiltre === null) {
          createElementsGalerie(newDataBase, galerieDyn);
        } else {
          createElementsGalerie(newDataBaseFiltre, galerieDyn);
        }
      }
      fetchAPIAjout();
    }
    envoieAPI();
  });
};

const createElementsGalerie = (e, f) => {
  for (let i = 0; i < e.length; i++) {
    const item = e[i];
    const img = document.createElement("div");
    img.classList.add("galerie-dyn_item");
    img.id = `id${parseInt(i)}`;
    img.innerHTML = `<img src=${item.imageUrl} alt=${item.title} class="img-dyn">
     <div class="logo-black2"><img src="./assets/icons/multicross.svg" alt="multicross"></div>`;

    f.appendChild(img);

    const edit = document.createElement("p");
    edit.textContent = "éditer";
    edit.id = `edit${img.id}`;
    img.appendChild(edit);

    const bin = document.createElement("div");
    bin.classList.add("logo-black");
    bin.innerHTML = `<img src="./assets/icons/bin.svg" alt="bin">`;
    bin.id = `Super${img.id}`;
    img.appendChild(bin);
    bin.addEventListener("click", () => {
      const deleteReally = document.getElementById("flyingcookie");

      deleteReally.innerHTML = `<p>Êtes vous sûr(e) de vouloir supprimer cette photo?</p>
			<div class="flyingInputs"><input type="submit" value="Oui" id="accept">
				<input type="submit" value="Non" id="deny">
			</div>`;
      const yesDelete = document.getElementById("accept");
      const noDont = document.getElementById("deny");

      deleteReally.classList.add("surprise");

      noDont.addEventListener("click", () => {
        deleteReally.classList.remove("surprise");
        deleteReally.innerHTML = "";
      });
      yesDelete.addEventListener(
        "click",
        () => {
          deleteReally.classList.remove("surprise");
          ActionDelete(bin);
          deleteReally.innerHTML = "";
        },
        { once: true }
      );
    });
  }
};
let difference = [];

const ActionDelete = (bin) => {
  difference = [];
  const galerieDyn = document.getElementById("galerie-dyn");
  let NumberToUse = bin.id.slice(7);
  if (dataBaseFiltres) {
    newDataBaseFiltre.splice(NumberToUse, 1);
    if (dataBaseFiltres[0].categoryId == 1) {
      filtresObjets = newDataBaseFiltre;
      modifInt(1);
      newDataBase.push(...filtresObjets);
      filtresGlobaux = newDataBase;
      difference = dataBase.filter((x) => !newDataBase.includes(x));
      DeleteData(difference[0]);
      dataBase = newDataBase;
      dataBaseFiltres = dataBase.filter((d) => {
        return d.categoryId == 1;
      });
      galerieDyn.innerHTML = "";
      createElementsGalerie(newDataBaseFiltre, galerieDyn);
    } else if (dataBaseFiltres[0].categoryId == 2) {
      filtresAppartements = newDataBaseFiltre;
      modifInt(2);
      newDataBase.push(...filtresAppartements);
      filtresGlobaux = newDataBase;
      difference = dataBase.filter((x) => !newDataBase.includes(x));
      DeleteData(difference[0]);
      dataBase = newDataBase;
      dataBaseFiltres = dataBase.filter((d) => {
        return d.categoryId == 2;
      });
      galerieDyn.innerHTML = "";
      createElementsGalerie(newDataBaseFiltre, galerieDyn);
    } else {
      filtresHotels = newDataBaseFiltre;
      modifInt(3);
      newDataBase.push(...filtresHotels);
      filtresGlobaux = newDataBase;
      difference = dataBase.filter((x) => !newDataBase.includes(x));
      DeleteData(difference[0]);
      dataBase = newDataBase;
      dataBaseFiltres = dataBase.filter((d) => {
        return d.categoryId == 3;
      });
      galerieDyn.innerHTML = "";
      createElementsGalerie(newDataBaseFiltre, galerieDyn);
    }
    filtresGlobaux.sort((a, b) => {
      return a.id - b.id;
    });
    newDataBase.sort((a, b) => {
      return a.id - b.id;
    });
  } else {
    newDataBase.splice(NumberToUse, 1);
    difference = dataBase.filter((x) => !newDataBase.includes(x));
    DeleteData(difference[0]);
    filtresGlobaux = newDataBase;
    dataBase.splice(NumberToUse, 1);
    galerieDyn.innerHTML = "";
    createElementsGalerie(newDataBase, galerieDyn);
    filtresObjets = newDataBase.filter((d) => {
      return d.categoryId == 1;
    });
    filtresAppartements = newDataBase.filter((d) => {
      return d.categoryId == 2;
    });
    filtresHotels = newDataBase.filter((d) => {
      return d.categoryId == 3;
    });
  }
};

const DeleteData = (e) => {
  let numberToDelete = e.id;
  console.log(numberToDelete);
  async function EnvoieDelete() {
    await fetch(`http://localhost:5678/api/works/${numberToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  EnvoieDelete();
};

const modifInt = (f) => {
  newDataBase = newDataBase.filter((e) => {
    return e.categoryId !== f;
  });
};

//Import d'une image_________________________________________________________________________

let imageReady = false;

const innerCreateImg = () => {
  const inputFile = document.getElementById("inputFile");
  const inputImg = document.getElementById("image");
  const outputImg = document.getElementById("output");
  const imageClickable = document.getElementById("imageClickable");
  const imageIndications = document.getElementById("indications");
  const imageIndicationsRed = document.getElementById("indicationsRed");
  const inLabel = document.getElementById("inlabel");
  let imageUpload = [];

  inputImg.addEventListener("change", () => {
    const file = inputImg.files;
    imgURL = inputImg.value;
    imageUpload.push(file[0]);
    if (imageUpload[0] == undefined) {
      imageUpload = [];
    } else {
      if (imageUpload[0].size > 4000000) {
        imageIndicationsRed.classList.remove("majax");
        imageUpload = [];
      } else {
        inputFile.classList.add("bigger");
        inLabel.textContent = "";
        imageIndicationsRed.classList.add("majax");
        imageClickable.classList.add("majax");
        imageIndications.classList.add("majax");
        outputImg.classList.remove("majax");
        displayImg();
        imageReady = true;
        imgToPull = [];
        imgToPull.push(...imageUpload);
        const categorieNew = document.getElementById("category");
        const nameNew = document.getElementById("title");
        const submit = document.getElementById("validationPhoto");
        if (categorieNew.value !== "" && nameNew.value !== "") {
          submit.classList.remove("inactiveOne");
          submit.removeAttribute("disabled");
        }
        imageUpload = [];
      }
    }
  });

  const displayImg = () => {
    let images = "";
    images += `<img src="${URL.createObjectURL(
      imageUpload[0]
    )}" alt="imageUpload">`;

    outputImg.innerHTML = images;
  };
};

// Validation formulaire_______________________________________________________________________

const formFunctionnal = () => {
  const indicationsRed2 = document.getElementById("indicationsRed2");
  const submit = document.getElementById("validationPhoto");
  const categorieNew = document.getElementById("category");
  const nameNew = document.getElementById("title");
  const arrayValidation = [categorieNew, nameNew];

  arrayValidation.forEach((e) => {
    e.addEventListener("change", () => {
      if (
        imageReady === true &&
        categorieNew.value !== "" &&
        nameNew.value !== ""
      ) {
        submit.classList.remove("inactiveOne");
        submit.classList.remove("inactiveThree");
        submit.removeAttribute("disabled");
        indicationsRed2.classList.add("majax");
      } else {
        if (!submit.disabled) {
          submit.classList.add("inactiveOne");
          submit.classList.add("inactiveThree");
          submit.setAttribute("disabled", "");
          indicationsRed2.classList.remove("majax");
        }
      }
    });
  });
};

//Event sur les filtres______________________________________________________________________

let filterGlobal = ["all", 1, 2, 3];
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
    return e != index;
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
    0;
  }
};

let filtresAppartements = null;
let filtresObjets = null;
let filtresHotels = null;

const filtresFinaux = (e) => {
  dataBaseFiltres = dataBase.filter((d) => {
    return d.categoryId == e;
  });
  newDataBaseFiltre = newDataBase.filter((d) => {
    return d.categoryId == e;
  });
  if (e == 2) {
    filtresAppartements = newDataBaseFiltre;
    filtresFunction(filtresAppartements);
  } else if (e == 1) {
    filtresObjets = newDataBaseFiltre;
    filtresFunction(filtresObjets);
  } else if (e == 3) {
    filtresHotels = newDataBaseFiltre;
    filtresFunction(filtresHotels);
  }
};

const filtresFunction = (e) => {
  galerie.innerHTML = "";
  createElements(e);
};
