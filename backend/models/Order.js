const mongoose = require("mongoose");

// Each line item snapshots name/price at order time so history stays accurate
// even if the menu price changes later.
const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
