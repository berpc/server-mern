const express = require("express");
const multiparty = require("connect-multiparty");
const WaterController = require("../controllers/water");
const md_auth = require("../middlewares/authenticated");

const api = express.Water();

api.get("/water/:id", [md_auth.asureAuth], WaterController.getWater);
api.get("/waters", [md_auth.asureAuth], WaterController.getWater);
api.post("/add-water", [md_auth.asureAuth], WaterController.createWater);
api.put("/update-water/:id",[md_auth.asureAuth], WaterController.updateWater);
api.delete("/delete-water/:id", [md_auth.asureAuth], WaterController.deleteWater);

module.exports = api;
