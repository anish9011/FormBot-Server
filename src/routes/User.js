const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const validateUser = require('../middlewares/validateUser');

const { loginUser, registerUser, updateUser, userDashboard,returnUser } = require('../controllers/User');

router.post('/user/login', validateUser, loginUser);
router.post('/user/register', validateUser, registerUser);
router.post('/user/update', verifyToken, validateUser, updateUser);
router.get('/user/dashboard', verifyToken, userDashboard);
router.post('/user/return',verifyToken, returnUser);

module.exports = router;