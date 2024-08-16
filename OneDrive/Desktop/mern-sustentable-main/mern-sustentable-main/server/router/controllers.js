const express = require("express");
const multiparty = require("connect-multiparty");
const controllersController = require("../controllers/controllers");
const md_auth = require("../middlewares/authenticated");

const api = express.Controller();

api.get("controllers/controll/:id", [md_auth.asureAuth], ControllerController.getController);
api.get("/Controllers", [md_auth.asureAuth], ControllerController.getControllers);
api.post("/add-controllers", [md_auth.asureAuth], ControllerController.createController);
api.put("/update-controllers/:id",[md_auth.asureAuth], ControllerController.updateController);
api.delete("/delete-controllers/:id", [md_auth.asureAuth], controllersController.deleteController);

module.exports = api;
