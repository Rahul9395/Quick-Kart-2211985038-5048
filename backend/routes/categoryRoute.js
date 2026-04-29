const isAuthenticated = require('../config/auth');
const isAdmin = require('../config/isAdmin');
const { addCategory, allCategorys, deleteCategory } = require('../controllers/categoryController');

const categoryRoute= require('express').Router();


categoryRoute.post('/add-category',isAuthenticated,isAdmin,addCategory);
categoryRoute.get('/all-categorys',isAuthenticated,isAdmin,allCategorys);
categoryRoute.delete('/delete-category/:_id',isAuthenticated,isAdmin,deleteCategory);


// for user

categoryRoute.get('/get-all-categories', allCategorys);


module.exports=categoryRoute;