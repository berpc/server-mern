const bcrypt = require("bcryptjs");
const Water = require("../models/water");
const { deleteCompany } = require("./company");

async function getWater(req, res) {
  const { id } = req.params;

  const response = await Site.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Agua" });
  } else {
    res.status(200).send(response);
  }
}

async function getWaters(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Water.find();
  } else {
    response = await Water.find({ active });
  }

  res.status(200).send(response);
}

async function createWater(req, res) {
  const water = new Site({ ...req.body, active: true });

  water.save((error, waterStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del agua" });
    } else {
      res.status(200).send(waterStored);
    }
  });
}

async function updateWater(req, res) {
  const { id } = req.params;
  const Data = req.body;

  Water.findByIdAndUpdate({ _id: id }, waterData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del agua" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteWater(req, res) {
  const { id } = req.params;

  Water.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del agua" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getWater,
  getWaters,
  createWater,
  updateWater,
  deleteWater,
};