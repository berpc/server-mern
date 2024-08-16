const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const site = require("./site");

const SiteSchema = mongoose.Schema({
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
  installation_type: String,
  product_category: String,
  days_month:Number,
  days_total:Number,
  hours_month:Number,
  hours_total:Number,
  temporary_workers:Number,
  permanent_production_workers:Number,
  permanent_administrative_workers:Number,
  female_production_workers:Number,
  male_production_workers:Number,
  female_administrative_workers:Number,
  male_administrative_workers:Number,
  female_workers_leadership_positions:Number,
  male_workers_leadership_positions:Number,
  // average_total_workers
  // average_female_workers
  // average_male_workers
  // percentage_total_female
  // percentage_total_male
  // percentage_female_leadership_positions
  // males_Leadership_positions 
  work_accidents_with_sick_days:Number,
  first_aid_without_sick_days:Number,
  active:Boolean
});

SiteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Site", SiteSchema);
