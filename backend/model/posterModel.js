const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true, 
    },
    title: {
      type: String,
      required: false,
      trim: true,
    },
    offer: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.models.Poster || mongoose.model('Poster', posterSchema);
