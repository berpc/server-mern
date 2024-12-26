const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const water = require("./water");

const WaterSchema = mongoose.Schema({
  date: Date,
  creator_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  period:String,
    year:String,
    state: String,
    // company:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Company'
    // },
    site:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site'
    },
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
  municipal_network_water:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  cost_of_water_from_the_municipal_network:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  rainwater_harvesting:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  groundwater:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  surface_water:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  percentage_network_water:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  percentage_surface_water:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  percentage_groundwater:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  total_water_consumed_per_unit_produced:{
    code:String,
    unit: String,
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean,
     files:[{
      url:String, name:String, uniqueName:String}],
  },
  
  active:Boolean
});

WaterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Water", WaterSchema);
