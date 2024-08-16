const express = require("express");
const multiparty = require("connect-multiparty");
const ModelController = require("../controllers/models");
const md_auth = require("../middlewares/authenticated");

const api = express.Model();

api.get("/models/:id", [md_auth.asureAuth], ModelController.getModel);
api.get("/Models", [md_auth.asureAuth], ModelController.getModels);
api.post("/add-models", [md_auth.asureAuth], ModelController.createModel);
api.put("/update-models/:id",[md_auth.asureAuth], ModelController.updateModel);
api.delete("/delete-models/:id", [md_auth.asureAuth], ModelController.deleteModel);

module.exports = api;
