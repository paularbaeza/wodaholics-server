//conectar a la base de datos
require("../db");

//los datos
const wods = require("./wods.json")


//requerir el modelo
const Wod = require("../models/Wod.model");

async function storeWods () {
  try {
    await Wod.insertMany(wods);
    console.log("Wods agregados a la BD");
  } catch (err) {
    console.log("Error al agregar los wods", err);
  }
};

storeWods();
