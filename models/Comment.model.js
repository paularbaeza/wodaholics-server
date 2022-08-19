const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    wod: [{
        type: Schema.Types.ObjectId,
        ref: "Wod",
      }],
    title: String,
    comment: String
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
