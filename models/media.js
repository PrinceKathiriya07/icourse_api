const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  [
    {
      course_Id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
