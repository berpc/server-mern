const express = require("express");
const multiparty = require("connect-multiparty");
const RoleController = require("../controllers/role");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.get("/role/:id", [md_auth.asureAuth], RoleController.getRole);
api.get("/roles", [md_auth.asureAuth], RoleController.getRoles);
api.post("/add-role", [md_auth.asureAuth], RoleController.createRole);
api.put("/update-role/:id",[md_auth.asureAuth], RoleController.updateRole);
api.delete("/delete-role/:id", [md_auth.asureAuth], RoleController.deleteRole);

module.exports = api;