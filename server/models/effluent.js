const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const effluent = require("./effluent");

const Effluentchema = mongoose.Schema({
  date: Date,
  period:String,
  year:String,
  creator_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  state: String,
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  site:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  },
  total_domestic_effluents:{
    code:String,
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
  total_industrial_effluents:{
    code:String,
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
  sludge_mud_sent_for_disposal_landfill:{
    code:String,
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
  total_effluents_per_unit_produced:{
    code:String,
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
  percentage_domestic_effluents:{
    code:String,
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
  percentage_industrial_effluents:{
    code:String,
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

Effluentchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Effluent", Effluentchema);
