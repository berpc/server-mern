const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const water = require("./water");

const WaterSchema = mongoose.Schema({
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

  Municipal_Network_water:Number,
  Cost_of_water_from_the_municipal_network:Number,
  Rainwater_harvesting:Number,
  groundwater:Number,
  Superficial_water:Number,
   network_water:Number,
  superficial_water:Number,
  underground_water:Number,
  Total_water_consumed_per_unit_produced:Number,
  
  active:Boolean
});

WaterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Water", WaterSchema);
