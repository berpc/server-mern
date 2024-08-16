const express = require("express");
const multiparty = require("connect-multiparty");
const EnergyController = require("../controllers/energy");
const md_auth = require("../middlewares/authenticated");

const api = express.Energy();

api.get("/energy/:id", [md_auth.asureAuth], EnergyController.getEnergy);
api.get("/energies", [md_auth.asureAuth], EnergyController.getEnergies);
api.post("/add-energy", [md_auth.asureAuth], EnergyController.createEnergy);
api.put("/update-energy/:id",[md_auth.asureAuth], EnergyController.updateEnergy);
api.delete("/delete-energy/:id", [md_auth.asureAuth], EnergyController.deleteEnergy);

module.exports = api;
