const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: Array,
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, required: true },
});

schema.virtual("id").get(function () {
  return this._id.toString();
});

schema.plugin(paginate);

module.exports = mongoose.model("Product", schema, "products");
