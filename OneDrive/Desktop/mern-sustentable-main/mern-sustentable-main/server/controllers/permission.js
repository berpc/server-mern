const bcrypt = require("bcryptjs");
const Permission = require("../models/permission");

async function getPermission(req, res) {
  const { id } = req.params;

  const response = await Permission.findById(id);
  // console.log(response)
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el permiso" });
  } else {
    res.status(200).send(response);
  }
}

async function getPermissions(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined || active === "undefined") {
    response = await Permission.find().sort({active:-1}).populate("role");
  } else {
    response = await Permission.find({ active }).sort({active:-1}).populate("role");
  }
  
  if (!response) {
    res.status(400).send({ code:400, msg: "No se ha encontrado permisos" });
  } else {
    res.status(200).send(response);
  }
  // res.status(200).send(response);
}

async function getPermissionsByRoleId(req, res) {
  const { id } = req.params;
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Permission.find({ role:id });
  } else {
    response = await Permission.find({ role:id , active});
  }
  
  if (!response) {
    res.status(400).send({ code:400, msg: "No se ha encontrado permisos" });
  } else {
    res.status(200).send(response);
  }
  // res.status(200).send(response);
}


async function createPermission(req, res) {
  //console.log(req.body);
  const permission = new Permission({ ...req.body, active: true });

  permission.save((error, permissionStored) => {
    if (error) {
      console.log(error)
      res.status(400).send({ msg: "Error al crear el permiso" });
    } else {
      res.status(201).send(permissionStored);
    }
  });
}

async function updatePermission(req, res) {
  const { id } = req.params;
  const permissionData = req.body;

  Permission.findByIdAndUpdate({ _id: id }, permissionData, (error,response) => {
    if (error) {
      console.log(error)
      res.status(400).send({ msg: "Error al actualizar el permiso" });
    } else {
      // console.log(response)
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deletePermission(req, res) {
  const { id } = req.params;

  Permission.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el permiso" });
    } else {
      res.status(200).send({ msg: "Permiso eliminado" });
    }
  });
}

async function getPermissionsByRoleAndModule(req, res) {
  const { id } = req.params;
  const { module, action } = req.query;
  let response = null;

  response = await Permission.find({ role:id, module:module});
  
  if (!response) {
    res.status(400).send({ code:400, msg: "No se ha encontrado permisos" });
  } else {
    res.status(200).send({response});
  }
  // res.status(200).send(response);
}

module.exports = {
  getPermission,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByRoleId,
  getPermissionsByRoleAndModule
};