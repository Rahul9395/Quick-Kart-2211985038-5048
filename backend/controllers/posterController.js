const posterModel = require('../model/posterModel');
const {deleteFromCloudinary} = require('../config/deleteFromCloudinary');

const getPosters = async (req, res) => {
  try {
    const posters = await posterModel.find();
    res.status(200).json({ success: true, posters });
  } catch (error) {
    console.error("Error fetching posters:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posters" });
  }
};


const addPoster = async (req, res) => {
  try {
    const { imageUrl, title, offer, description, public_id } = req.body;

    // Basic validation
    if (!imageUrl || !public_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Image URL, public_id, and title are required",
      });
    }

    // Create new poster
    const newPoster = new posterModel({
      imageUrl,
      public_id,
      title,
      offer,
      description,
    });

    const savedPoster = await newPoster.save();

    res.status(201).json({
      success: true,
      message: "Poster added successfully",
      poster: savedPoster,
    });

  } catch (error) {
    console.error("Error adding poster:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding poster",
    });
  }
};

const deletePoster = async (req, res) => {
  const { _id } = req.params;
  const { public_id } = req.body;

  try {
    // Delete image from cloudinary
    await deleteFromCloudinary(public_id);

    // Delete poster from MongoDB
    await posterModel.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Poster and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting poster:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete poster",
    });
  }
};


module.exports = { getPosters,addPoster, deletePoster };
