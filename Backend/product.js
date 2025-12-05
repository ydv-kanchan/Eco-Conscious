const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  carbonFootprint: { type: Number, required: true },
  materialSourcing: { type: String, required: true },
  recyclability: { type: Number, required: true },
  waterUsage: { type: String, required: true },
  energyEfficiency: { type: String, required: true },
  biodegradability: { type: Number, required: true },
  durability: { type: String, required: true },
  ecoScore: { type: Number, required: false },
  productType: { type: String, required: true },
});

// Check if the model is already compiled to avoid overwriting
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
