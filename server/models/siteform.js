const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const siteForm = require("./siteform");

const SiteFormSchema = mongoose.Schema({
  date: Date,
  creator_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  state: String,
  period:String, 
  year:String,
  site:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  },
  installation_type: {
    value:String,
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
  product_category:  {
    value:String,
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
  days_month: {
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
  days_total:{
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
  hours_month:{
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
  hours_total:{
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
  temporary_workers:{
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
  permanent_production_workers:{
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
  permanent_administrative_workers:{
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
  female_production_workers:{
    value:Number,
    reviews:[{
      date:Date,
      reviewer_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments:String
    }],
    isApproved:Boolean
  },
  male_production_workers:{
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
  female_administrative_workers:{
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
  male_administrative_workers:{
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
  female_workers_leadership_positions:{
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
  male_workers_leadership_positions:{
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
  // average_total_workers
  // average_female_workers
  // average_male_workers
  // percentage_total_female
  // percentage_total_male
  // percentage_female_leadership_positions
  // percentage_male_leadership_positions 
  work_accidents_with_sick_days:{
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
  first_aid_without_sick_days:{
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

SiteFormSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("siteform", SiteFormSchema);
