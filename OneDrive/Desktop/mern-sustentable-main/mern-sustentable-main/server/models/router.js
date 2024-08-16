const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const router = require("./router");

const RouterSchema = mongoose.Schema({
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
  output:Number,

 
  active:Boolean
});

RouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Router", RouterSchema);

