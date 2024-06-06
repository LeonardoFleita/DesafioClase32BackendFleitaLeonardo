const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: String,
  purchase_datetime: Date,
  amount: Number,
  purchaser: String,
});

schema.virtual("id").get(function () {
  return this._id.toString();
});

module.exports = mongoose.model("Ticket", schema, "tickets");
