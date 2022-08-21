const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    email: {
      type:String, 
      unique:true
    },
    password: String,
    img:{
      type:String,
      default: "/images/defaultuser.jpg"
    },
    role:{
      type:String,
      default: "user"
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    favWods: [{
      type: Schema.Types.ObjectId,
      ref: "Wod",
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
