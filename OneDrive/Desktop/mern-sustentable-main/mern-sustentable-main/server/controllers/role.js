const bcrypt = require("bcryptjs");
const Role = require("../models/role");

async function getRole(req, res) {
  const { id } = req.params;

  const response = await Role.findById(id);
  
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el rol" });
  } else {
    res.status(200).send(response);
  }
}

async function getRoles(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Role.find({"name":{$not:{ $regex: "Master" }}}); // restringir el rol master
  } else {
    response = await Role.find({ active, "name":{$not:{ $regex: "Master" }}}); //restringir el rol master
  }

  res.status(200).send(response);
}

async function createRole(req, res) {
  const role = new Role({ ...req.body, active: true });

  role.save((error, roleStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el rol" });
    } else {
      res.status(201).send(roleStored);
    }
  });
}

async function updateRole(req, res) {
  const { id } = req.params;
  const roleData = req.body;

  Role.findByIdAndUpdate({ _id: id }, roleData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el rol" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteRole(req, res) {
  const { id } = req.params;

  Role.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el rol" });
    } else {
      res.status(200).send({ msg: "Rol eliminado" });
    }
  });
}

module.exports = {
  getRole,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};