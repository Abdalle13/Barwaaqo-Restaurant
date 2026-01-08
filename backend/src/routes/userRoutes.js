// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', loginUser);


//CRUD operations protected by auth middleware
router.get('/', auth, getAllUsers);
router.get('/:id', auth, updateUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;