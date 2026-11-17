const express = require('express');
const router = express.Router();
const Users = require('../model/userModel');
const {body, header, query, param, validationResult} = require('express-validator');
const { toggleBookmark } = require('../controllers/userControllers');

// 👇 UPDATED: Import getUserProfile
const { getAllusers, registerUser, loginUser, updateUser, deleteUser, getUserProfile } = require('../controllers/userControllers');
const validators = require('../middlewares/validators');

// 👇 NEW: Import the checkLogin middleware
const checkLogin = require('../middlewares/checkLogin'); 

router.get('/', getAllusers);
router.post('/register', validators, registerUser);
router.post('/login', loginUser);
router.put('/update', updateUser);
router.delete('/delete', deleteUser);

// 👇 NEW: The secure route to fetch the logged-in user's profile
router.get('/me', checkLogin, getUserProfile);
// Add this line to your user routes
router.post("/bookmark", checkLogin, toggleBookmark);

module.exports = router;