const mongoose = require('mongoose');
const Product = require('./productModel');
const Order = require('./orderModel');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    url: {
      type: String,
      default: ""
    },
    public_id: {
      type: String,
      default: ""
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },

  address: {
    houseName: { type: String },
    landmark: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String, default: 'India' },
    phone: {
      type: String,
    }
  },

  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      size: String,
      color: String
    }
  ],

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],

  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],

  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
