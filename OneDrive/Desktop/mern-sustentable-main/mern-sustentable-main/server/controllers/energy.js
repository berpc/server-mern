const bcrypt = require("bcryptjs");
const Energy = require("../models/enerny");
const Fuel = require("..models/energy")
const { deleteEnergy } = require("./energy");
const {deleteFuel} = require("./energy")

async function getEnergy(req, res) {
  const { id } = req.params;
        

  const response = await Site.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Energia" });
  } else {
    res.status(200).send(response);
    
  }

}

async function getEnergy(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Energy.find();
  } else {
    response = await Energy.find({ active });
  }

  res.status(200).send(response);
}

async function createEnergy(req, res) {
  const energy = new Energy({ ...req.body, active: true });

  energy.save((error, energyStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del Energia" });
    } else {
      res.status(200).send(energyStored);
    }
  });
}

async function updateEnergy(req, res) {
  const { id } = req.params;
  const energyData = req.body;

  Energy.findByIdAndUpdate({ _id: id }, energyData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del energia" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteEnergy(req, res) {
  const { id } = req.params;

  Energy.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del energia" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getEnergy,
  getEnergy,
  createEnergy,
  updateEnergy,
  deleteEnergy,
};
