const { Schema, model } = require("mongoose");

const wodSchema = new Schema(
  { creator:{
    type:String,
    default: "Crossfit DataBase"
  },
    wodType: {
      type: String,
      enum: ["girls", "heroes", "weights"],
    },
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    exercises: ["String"],
    equipment: ["String"],
  },
  {
    timestamps: true,
  }
);

const Wod = model("Wod", wodSchema);

module.exports = Wod;
