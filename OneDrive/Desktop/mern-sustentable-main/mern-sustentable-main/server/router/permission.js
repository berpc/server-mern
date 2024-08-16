const express = require("express");
const multiparty = require("connect-multiparty");
const PermissionController = require("../controllers/permission");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({ uploadDir: "./uploads/avatar" });
const api = express.Router();

api.get("/permission/:id", [md_auth.asureAuth], PermissionController.getPermission);
api.get("/permissions", [md_auth.asureAuth], PermissionController.getPermissions);
api.get("/permissions-role/:id", [md_auth.asureAuth], PermissionController.getPermissionsByRoleId);
api.get("/permissions-role-module/:id", [md_auth.asureAuth], PermissionController.getPermissionsByRoleAndModule);
api.post("/add-permission", [md_auth.asureAuth], PermissionController.createPermission);
api.put("/update-permission/:id",[md_auth.asureAuth], PermissionController.updatePermission);
api.delete("/delete-permission/:id", [md_auth.asureAuth], PermissionController.deletePermission);

module.exports = api;