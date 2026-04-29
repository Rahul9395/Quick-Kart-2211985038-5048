const ProductModel = require('../model/productModel');
const { deleteFromCloudinary } = require('../config/deleteFromCloudinary')
const CategoryModel = require('../model/categoryModel')

const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      discount,
      images,
      category,
      specs,
      stock,
      description,
      rating,
    } = req.body;

    // Basic validation
    if (!name || !brand || !price || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Optional: Validate rating range
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    // Create new product
    const newProduct = new ProductModel({
      name,
      brand,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock) || 1,
      images,
      category,
      specs: specs || [],
      description: description || "",
      rating: Number(rating) || 0,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });

  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};


// GET /api/products?page=1&limit=20
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await ProductModel.countDocuments();

    const products = await ProductModel.find()
      .populate('category', 'name')
      // .populate({
      //   path: 'reviews.user',
      //   select: 'name',
      // })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};



const getSearchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await ProductModel.findById(id)
      .populate('category', 'name')
      // .populate({
      //   path: 'reviews.user',
      //   select: 'name',
      // })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};



const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, price, discount, stock, specs } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        description,
        price,
        discount,
        stock,
        specs,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Step 1: Find product to get image public_ids
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Step 2: Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteFromCloudinary(img.public_id);
        }
      }
    }

    // Step 3: Delete the product from the database
    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

const getProductByIdandSuggestions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await ProductModel.findById(id)
      .populate('category', 'name')
      // .populate({
      //   path: 'reviews.user',
      //   select: 'name',
      // })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Fetch up to 10 suggested products from the same category (excluding the current product)
    const suggestions = await ProductModel.find({
      category: product.category._id,
      _id: { $ne: product._id } // exclude current product
    })
    .limit(10)
    .select('_id name price images discount description')
    .lean();

    res.status(200).json({
      success: true,
      product,
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching product by ID and suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    // 1. Find the category by slug
    const category = await CategoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // 2. Find products by category ID
    const products = await ProductModel.find({ category: category._id });

    // 3. Send response
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};



module.exports = {
  addProduct,
  getAllProducts,
  getSearchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByIdandSuggestions,
  getProductByCategory,
};
