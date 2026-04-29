const isAuthenticated = require('../config/auth');
const isAdmin = require('../config/isAdmin');
const { addProduct, getAllProducts, getSearchProducts, getProductById, updateProduct, deleteProduct, getProductByIdandSuggestions, getProductByCategory } = require('../controllers/productController');

const productRoute = require('express').Router();



productRoute.post('/add-product', isAuthenticated, isAdmin, addProduct);
productRoute.get('/all-products', isAuthenticated, isAdmin, getAllProducts);
productRoute.get('/search', isAuthenticated, isAdmin, getSearchProducts); 
productRoute.get('/product/:id', isAuthenticated, isAdmin, getProductById);
productRoute.put('/update-product/:id', isAuthenticated, isAdmin, updateProduct);
productRoute.delete('/delete-product/:id', isAuthenticated, isAdmin, deleteProduct);


// user

productRoute.get('/get-all-products', getAllProducts);
productRoute.get('/get-product/:id', getProductByIdandSuggestions);
productRoute.get('/get-products-by-category/:slug', getProductByCategory);
productRoute.get('/user-search', getSearchProducts);




module.exports = productRoute;