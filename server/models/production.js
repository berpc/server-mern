const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const site = require("./production");

const ProductionSchema = mongoose.Schema({
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
  production_volume:{
    code:String,
    value:Number,
    unit:String,
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
  annual_average:{
    code:String,
    value:Number,
    unit:String,
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

ProductionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Production", ProductionSchema);
