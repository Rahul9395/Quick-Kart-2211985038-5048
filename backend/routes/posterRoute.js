const isAuthenticated = require('../config/auth');
const isAdmin = require('../config/isAdmin');
const { getPosters, addPoster,deletePoster } = require('../controllers/posterController');
const posterRoute=require('express').Router();



// admin Route
posterRoute.get('/getPosters',isAuthenticated,isAdmin,getPosters);
posterRoute.post('/addPoster',isAuthenticated,isAdmin,addPoster);
posterRoute.delete('/delete/:_id',isAuthenticated,isAdmin,deletePoster);

// user Route

posterRoute.get('/get-all-poster',getPosters);





module.exports=posterRoute;