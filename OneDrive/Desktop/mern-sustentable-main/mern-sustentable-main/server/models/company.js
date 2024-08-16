const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  name: String,
  cuit: String,
  address: String,
  phone: String,
  email: String,
  active: Boolean,
});

module.exports = mongoose.model("Company", CompanySchema);
