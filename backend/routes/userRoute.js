const userRoute= require('express').Router();
const isAuthenticated = require('../config/auth.js');
const isAdmin = require('../config/isAdmin.js')

const {registerUser,loginUser, sendOtp, getUserDetails, sendLink, resetPassword, updateAddress, 
    uploadProfileImage, getAllUsers, getUserById, updateUserRole, deleteUser
}= require('../controllers/userController')

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.post('/send-otp', sendOtp);
userRoute.get('/me', isAuthenticated, getUserDetails)
userRoute.post('/forgot-password', sendLink)
userRoute.post('/reset-password',resetPassword )
userRoute.put('/update-address',isAuthenticated, updateAddress)
userRoute.put('/update-avatar',isAuthenticated, uploadProfileImage)
userRoute.get('/all-users', isAuthenticated, isAdmin, getAllUsers)
userRoute.get('/get-user-by-id/:id', getUserById);
userRoute.put('/:id/role',isAuthenticated, isAdmin, updateUserRole);
userRoute.delete('/:id/delete', isAuthenticated, isAdmin, deleteUser);

module.exports = userRoute;