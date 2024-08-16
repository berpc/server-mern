const express = require("express");
const multiparty = require("connect-multiparty");
const CompanyController = require("../controllers/company");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.get("/company/:id", [md_auth.asureAuth], CompanyController.getCompany);
api.get("/companies", [md_auth.asureAuth], CompanyController.getCompanies);
api.post("/add-company", [md_auth.asureAuth], CompanyController.createCompany);
api.put("/update-company/:id",[md_auth.asureAuth], CompanyController.updateCompany);
api.delete("/delete-company/:id", [md_auth.asureAuth], CompanyController.deleteCompany);

module.exports = api;