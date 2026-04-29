
const cartRoute= require('express').Router();
const isAuthenticated = require('../config/auth.js');
const { addToCart, updateCartQuantity, getCartItems, removeFromCart } = require('../controllers/cartController');



cartRoute.post('/add-to-cart', isAuthenticated, addToCart)
cartRoute.put('/update-quantity', isAuthenticated, updateCartQuantity);
cartRoute.get('/cart-items', isAuthenticated, getCartItems);
cartRoute.delete('/remove-from-cart/:productId',isAuthenticated,removeFromCart)

module.exports = cartRoute;