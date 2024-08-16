const bcrypt = require("bcryptjs");
const Router = require("../models/router");
const { deleteCompany } = require("./company");

async function getRouter(req, res) {
  const { id } = req.params;

  const response = await Router.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Sitio" });
  } else {
    res.status(200).send(response);
  }
}

async function getRouters(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Router.find();
  } else {
    response = await Router.find({ active });
  }

  res.status(200).send(response);
}

async function createRouter(req, res) {
  const router = new Router({ ...req.body, active: true });

  router.save((error, routerStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del sitio" });
    } else {
      res.status(200).send(routerStored);
    }
  });
}

async function updateRouter(req, res) {
  const { id } = req.params;
  const routerData = req.body;

  Router.findByIdAndUpdate({ _id: id }, routerData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteRouter(req, res) {
  const { id } = req.params;

  Router.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getRouter,
  getRouters,
  createRouter,
  updateRouter,
  deleteRouter,
};
