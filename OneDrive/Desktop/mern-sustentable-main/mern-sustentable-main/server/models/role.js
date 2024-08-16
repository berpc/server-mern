const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
  // role_code:{
  //     type: Number,
  //     unique: true
  // },
  name:{
      type: String,
      unique: true
  },
  description: String,
  active: Boolean
});

module.exports = mongoose.model("Role", RoleSchema);
