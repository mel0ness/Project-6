let dataBase;

const response = await fetch("http://localhost:5678/api/works");
dataBase = await response.json();

console.log(dataBase[3]);

dataBase.splice(3, 4);
console.log(dataBase);
