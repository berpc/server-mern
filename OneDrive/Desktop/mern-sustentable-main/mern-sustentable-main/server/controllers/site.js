const bcrypt = require("bcryptjs");
const Site = require("../models/site");
const { deleteCompany } = require("./company");

async function getSite(req, res) {
  const { id } = req.params;

  const response = await Site.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario del Sitio" });
  } else {
    res.status(200).send(response);
  }
}

async function getSites(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Site.find();
  } else {
    response = await Site.find({ active });
  }

  res.status(200).send(response);
}

async function createSite(req, res) {
  const site = new Site({ ...req.body, active: true });

  site.save((error, siteStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario del sitio" });
    } else {
      res.status(200).send(siteStored);
    }
  });
}

async function updateSite(req, res) {
  const { id } = req.params;
  const siteData = req.body;

  Site.findByIdAndUpdate({ _id: id }, siteData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteSite(req, res) {
  const { id } = req.params;

  Site.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el formulario del sitio" });
    } else {
      res.status(200).send({ msg: "Formulario eliminado" });
    }
  });
}

module.exports = {
  getSite,
  getSites,
  createSite,
  updateSite,
  deleteSite,
};
