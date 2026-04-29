const CategoryModel = require('../model/categoryModel');
const { deleteFromCloudinary } = require('../config/deleteFromCloudinary');

const addCategory = async (req, res) => {
    try {
        const { name, description, imageUrl, public_id } = req.body;

        // Validate required fields
        if (!name || !description || !imageUrl || !public_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (name, description, imageUrl, public_id)",
            });
        }

        // Check for duplicate category name
        const existing = await CategoryModel.findOne({ name });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        // Create and save new category
        const category = new CategoryModel({
            name,
            description,
            imageUrl,
            public_id,
        });

        await category.save();

        return res.status(201).json({
            success: true,
            message: "Category added successfully",
            category,
        });
    } catch (error) {
        console.error("Add Category Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



const allCategorys = async (req, res) => {
    try {
        const categorys = await CategoryModel.find().sort({ createdAt: -1 }); // optional: sort newest first

        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            categorys,
        });

    } catch (error) {
        console.error("Fetch All Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const { public_id } = req.body;

        // Validate ID
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required", 
            });
        }

        await deleteFromCloudinary(public_id);

        // Find and delete category
        const category = await CategoryModel.findByIdAndDelete(_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Delete Category Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


module.exports = { addCategory, allCategorys, deleteCategory };
