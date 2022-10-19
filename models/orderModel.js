const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required:true
    },
    billingAddress: [
      {
        firstName: String,
        lastName: String,
        phoneNumber: Number,
        email: String,
        address: String,
        city: String,
        state: String,
        pincode: Number,
      },
    ],
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: String,
    paymentMethod: String,
    orderId: String,
    grandTotal:Number
  },
  { timestamps: true }
);
const order = mongoose.model("Order", orderSchema);
module.exports = order;
