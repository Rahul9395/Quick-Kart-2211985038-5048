const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete function
const deleteFromCloudinary = async (publicId) => {
  try {
    console.log(publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Failed to delete from Cloudinary: ' + error.message);
  }
};

// Export both cloudinary and delete function if needed
module.exports = {
  cloudinary,
  deleteFromCloudinary,
};
