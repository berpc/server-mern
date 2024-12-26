const express = require("express");
const multiparty = require("connect-multiparty");
const ProductionController = require("../controllers/production");
const md_auth = require("../middlewares/authenticated");
const md_upload= multiparty({ uploadDir: "./uploads/files/production" }); 
const fs = require("fs");
const path = require("path");

if (!fs.existsSync("./uploads/files/production")) {
    fs.mkdirSync("./uploads/files/production", { recursive: true });
  }

const api = express.Router();

api.get("/production/:id", [md_auth.asureAuth], ProductionController.getProduction);
api.get("/productions", [md_auth.asureAuth], ProductionController.getProductions);
api.post("/add-production", [md_auth.asureAuth], ProductionController.createProduction);
api.put("/update-production/:id",[md_auth.asureAuth], ProductionController.updateProduction);
api.delete("/delete-production/:id", [md_auth.asureAuth], ProductionController.deleteProduction);
api.get("/productions-exists-site/:site/:period/:year", [md_auth.asureAuth], ProductionController.existsProductionFormBySiteAndPeriodAndYear);
api.get("/productions-periods-site-year/:site/:year", [md_auth.asureAuth], ProductionController.getPeriodProductionFormsBySiteAndYear);
api.get("/productions-site-year/:site/:year", [md_auth.asureAuth], ProductionController.getProductionFormsBySiteAndYear);

api.post("/upload-file-production/", [md_auth.asureAuth,md_upload], ProductionController.uploadFile);
api.get("/get-file-production/:fileName", ProductionController.getFile);
api.delete("/delete-file-production", ProductionController.deleteFile);


module.exports = api;
