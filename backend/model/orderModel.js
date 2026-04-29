


const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    houseName: { type: String },
    landmark: { type: String },
    street: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const paymentInfoSchema = new mongoose.Schema(
  {
    method: { type: String, required: true }, // "COD", "Stripe", "Razorpay"
    status: { type: String, default: 'pending' },
    transactionId: { type: String }, // Stripe payment_intent or Razorpay id
    sessionId: { type: String },     // Stripe Checkout Session ID
  },
  { _id: false }
);

// ✅ New Delivery Boy Schema
const deliveryBoySchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    phone: { type: String, required: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingInfo: {
      type: shippingInfoSchema,
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: false,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
    cancelledAt: Date,

    // ✅ New Field
    deliveryBoy: {
      type: deliveryBoySchema,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
