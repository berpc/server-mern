const express = require("express");
const multiparty = require("connect-multiparty");
const SiteController = require("../controllers/production");
const md_auth = require("../middlewares/authenticated");

const api = express.Production();

api.get("/site/:id", [md_auth.asureAuth], SiteController.getSite);
api.get("/sites", [md_auth.asureAuth], SiteController.getSites);
api.post("/add-site", [md_auth.asureAuth], SiteController.createSite);
api.put("/update-site/:id",[md_auth.asureAuth], SiteController.updateSite);
api.delete("/delete-site/:id", [md_auth.asureAuth], SiteController.deleteSite);

module.exports = api;
