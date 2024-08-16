const bcrypt = require("bcryptjs");
const Controller = require("../models/controllers");
const { deleteCompany } = require("./company");
const controllers = require("../models/controllers");

async function getController(req, res) {
  const { id } = req.params;

  const response = await Controller.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Sitio" });
  } else {
    res.status(200).send(response);
  }
}

async function getcontrollers(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Controller.find();
  } else {
    response = await Controller.find({ active });
  }

  res.status(200).send(response);
}

async function createController(req, res) {
  const controllers = new controllers({ ...req.body, active: true });

  controllers.save((error, controllersStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del sitio" });
    } else {
      res.status(200).send(controllersStored);
    }
  });
}

async function updateController(req, res) {
  const { id } = req.params;
  const ControllersData = req.body;

  Controller.findByIdAndUpdate({ _id: id }, ControllersData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteController(req, res) {
  const { id } = req.params;

  Controller.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getController,
  getControllers,
  createController,
  updateController,
  deleteController,
};