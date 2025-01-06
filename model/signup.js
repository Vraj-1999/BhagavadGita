const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const logSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],  // Limited to these values
      required: true
    },
    user_name:{
        type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: { type: String, default: 'default.jpg' }
    ,
    createdAt: {
      type: Date,
      default: Date.now
    },
    emailEnabled: { type: Boolean, default: true }
});


logSchema.pre("save", async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
})


const signs = mongoose.model("signs", logSchema);

module.exports = signs;
  