const { Schema, model } = require("mongoose");

const benchmarkSchema = new Schema(
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
    score: String,
    date: Date
  },
  {
    timestamps: true,
  }
);

const Benchmark = model("Benchmark", benchmarkSchema);

module.exports = Benchmark;
