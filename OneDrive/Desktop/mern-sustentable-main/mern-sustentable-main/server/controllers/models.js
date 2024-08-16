const bcrypt = require("bcryptjs");
const Model = require("../models/models");
const { deleteCompany } = require("./company");
const { model } = require("mongoose");
const models = require("../models/models");

async function getModels(req, res) {
  const { id } = req.params;

  const response = await models.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Sitio" });
  } else {
    res.status(200).send(response);
  }
}

async function getModels(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Model.find();
  } else {
    response = await Model.find({ active });
  }

  res.status(200).send(response);
}

async function create(req, res) {
  const models = new Model({ ...req.body, active: true });

  models.save((error, modelsStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del sitio" });
    } else {
      res.status(200).send(modelsStored);
    }
  });
}

async function updateModel(req, res) {
  const { id } = req.params;
  const modelsData = req.body;

  Model.findByIdAndUpdate({ _id: id }, modelsData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteModel(req, res) {
  const { id } = req.params;

  Model.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getModel,
  getModels,
  createModel,
  updateModel,
  deleteModel,
};
