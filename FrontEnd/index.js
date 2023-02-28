// Get API and able to use it is a var__________________________________

let dataBase = [];

// async function fetchAPI() {
//   const response = await fetch("http://localhost:5678/api/works");
//   dataBase = await response.json();
// }

// fetchAPI();

// Async function but scope probs! Better in module or call function each time? ++ module donesn't accept to define variables??? ________________

const response = await fetch("http://localhost:5678/api/works");
dataBase = await response.json();

console.log(dataBase);

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

createElements(dataBase);
