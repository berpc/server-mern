const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const energy = require("./kpis");

const KPIsSchema = mongoose.Schema({
  date: Date,
  creator_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  period:String,
  year:String,
  state: String,
  site:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  },
  energy_indicators:{
    total_fuel_energy_consumption:{
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
    total_electrical_energy_consumption:{
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
    total_energy_consumption:{
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
    total_renewable_energy:{
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
    percentage_of_renewable_energy:{
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
    percentage_energy_from_fossil_fuels:{
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
    total_energy_consumed_per_productive_unit:{
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
    total_cost_of_energy_consumed:{
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
  },
  greenhouse_gas_indicators:{
    code:String,
    unit: String,
    total_scope_1:{
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
    total_scope_2:{
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
    total_scope_3:{
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
    total_emissions_per_unit_produced:{
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
    total_emissions:{
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
    scope_percentage_1:{
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
    scope_percentage_2:{
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
    scope_percentage_3:{
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
  },
  active:Boolean
});

KPIsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Kpis", KPIsSchema);
