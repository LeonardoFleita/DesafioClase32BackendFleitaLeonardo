const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    default: [],
  },
});

schema.virtual("id").get(function () {
  return this._id.toString();
});

module.exports = mongoose.model("Cart", schema, "carts");
