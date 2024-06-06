const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", schema, "users");
