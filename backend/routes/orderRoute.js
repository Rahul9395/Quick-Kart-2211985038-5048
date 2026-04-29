const express = require('express');
const orderRoute = express.Router();
const isAuthenticated = require('../config/auth');
const {
    createOrder,
    orderCheckOut,
    stripeWebhook,  
    getSessionStatus,
    getAllOrders,
    getAllOrdersForAdmin,
    updateOrderStatus,
    cancelOrder,
    getMonthlyOrders,
    getYearlyOrders
} = require('../controllers/orderController');
const isAdmin = require('../config/isAdmin');

//user route
orderRoute.post('/create', isAuthenticated, createOrder);
orderRoute.post('/payment/checkout', isAuthenticated, orderCheckOut);
orderRoute.get('/payment/session/:sessionId', isAuthenticated, getSessionStatus);
orderRoute.get('/get-orders', isAuthenticated, getAllOrders);
orderRoute.patch("/cancel/:id", isAuthenticated, cancelOrder);


//admin route

orderRoute.get('/all-orders',isAuthenticated,isAdmin, getAllOrdersForAdmin);
orderRoute.put('/update-status/:orderId', isAuthenticated, isAdmin, updateOrderStatus);
orderRoute.get('/monthly', isAuthenticated, isAdmin, getMonthlyOrders);
orderRoute.get('/yearly', isAuthenticated, isAdmin, getYearlyOrders);


orderRoute.post(
    '/payment/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhook
);

module.exports = orderRoute;
