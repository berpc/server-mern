const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const energy = require("./energy");

const EnergySchema = mongoose.Schema({
  date: Date,
  creator_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  state: String,
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  reviews:[{
    date:Date,
    reviewer_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments:String,
    state:String,
  }],
  falta 
  active:Boolean
});

SiteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Site", SiteSchema);
