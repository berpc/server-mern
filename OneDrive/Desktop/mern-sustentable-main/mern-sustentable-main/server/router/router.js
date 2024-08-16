const express = require("express");
const multiparty = require("connect-multiparty");
const RouterController = require("../controllers/router");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.get("/router/:id", [md_auth.asureAuth], RouterController.getRouter);
api.get("/Routers", [md_auth.asureAuth], RouterController.getRouters);
api.post("/add-router", [md_auth.asureAuth], RouterController.createRouter);
api.put("/update-router/:id",[md_auth.asureAuth], RouterController.updateRouter);
api.delete("/delete-router/:id", [md_auth.asureAuth], RouterController.deleteRouter);

module.exports = api;
