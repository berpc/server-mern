const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const site = require("./dangerous");

const DangerousSchema = mongoose.Schema({
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
  chemicals_sent_to_reuse_or_recycle:{
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
  lubricants_sent_to_reuse_or_recycle:{
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
  oils_sent_to_reuse_or_recycle:{
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
  machines_and_equipment_sent_to_reuse_or_recycle:{
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
  electronic_waste_sent_to_reuse_or_recycle:{
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
  other_dangerous_wastes_sent_to_reuse_or_recycle:{
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
  chemicals_sent_to_incineration:{
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
  lubricants_sent_to_incineration:{
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
  oils_sent_to_incineration:{
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
  machines_and_equipment_sent_to_incineration:{
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
  electronic_waste_sent_to_incineration:{
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
  other_dangerous_wastes_sent_to_incineration:{
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
  chemicals_sent_to_landfill:{
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
  lubricants_sent_to_landfill:{
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

DangerousSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Dangerous", DangerousSchema);
