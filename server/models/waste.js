const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const waste = require("./waste");

const WasteSchema = mongoose.Schema({
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
  paper_and_cardboard_sent_to_recycling_or_reuse:{
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
  plastic_sent_to_recycle_or_reuse:{
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
  fabric_sent_to_recycle_or_reuse:{
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
  metal_sent_to_recycle_or_reuse:{
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
  wood_sent_to_recycle_or_reuse:{
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
  other_general_waste_sent_to_recycle_or_reuse:{
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
 leathers_sent_to_recycle_or_reuse:{
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
  rubber_sent_to_recycle_or_reuse:{
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
  food_scraps_sent_to_recycle_or_reuse:{
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
  paper_and_cardboard_sent_to_incineration:{
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
  plastic_sent_to_incineration:{
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
  fabric_sent_to_incineration:{
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
  metal_sent_to_incineration:{
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
  wood_sent_to_incineration:{
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
  other_general_waste_sent_to_incineration:{
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
  other_general_waste_sent_to_other_types_of_disposal:{
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
  total_sent_to_landfill:{
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
  total_sent_for_reuse_or_recycling:{
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
  total_sent_to_incineration:{
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
  total_general_waste_sent_to_other_types_of_disposal:{
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
  total_non_hazardous_waste_unit_produced:{
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

WasteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Waste", WasteSchema);
