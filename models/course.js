const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    // },
    user_Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // medias: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Media",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
