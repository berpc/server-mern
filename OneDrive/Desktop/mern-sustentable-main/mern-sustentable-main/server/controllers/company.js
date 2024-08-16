const bcrypt = require("bcryptjs");
const Company = require("../models/company");

async function getCompany(req, res) {
  const { id } = req.params;

  const response = await Company.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado la empresa" });
  } else {
    res.status(200).send(response);
  }
}

async function getCompanies(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Company.find();
  } else {
    response = await Company.find({ active });
  }

  res.status(200).send(response);
}

async function createCompany(req, res) {
  const company = new Company({ ...req.body, active: true });

  company.save((error, companyStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear la empresa" });
    } else {
      res.status(200).send(companyStored);
    }
  });
}

async function updateCompany(req, res) {
  const { id } = req.params;
  const companyData = req.body;

  Company.findByIdAndUpdate({ _id: id }, companyData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar la empresa" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteCompany(req, res) {
  const { id } = req.params;

  Company.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar la empresa" });
    } else {
      res.status(200).send({ msg: "Empresa eliminada" });
    }
  });
}

module.exports = {
  getCompany,
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};