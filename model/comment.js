const mongoose = require("mongoose");

const d = new Date();

const commentSchema = new mongoose.Schema({
    text_area : {
        type: String,
    },
    chapter_num:{
        type: Number,
    },
    verse_num :{
        type: Number
    },
    secret_id :{
        type: String
    },
    first_name:{
        type: String
    },
    last_name:{
        type: String
    },
    profilePicture:{
        type:String
    }
  },
  {timestamps:true}
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
  