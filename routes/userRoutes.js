const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// 1. Importar el middleware
const authMiddleware = require('../middleware/authMiddleware');

// Ruta Pública (Cualquiera entra)
router.post('/login', userController.login);
router.post('/register', userController.createUser);

// --- ZONA PROTEGIDA ---

router.get('/', authMiddleware, userController.getAllUsers); 

// Protejamos también las otras acciones críticas
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;