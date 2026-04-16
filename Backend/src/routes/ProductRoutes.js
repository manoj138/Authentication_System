const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

// All product routes are protected
router.use(authMiddleware.authenticateToken);

router.get('/', productController.getAllProducts);
router.get('/stats', productController.getProductStats);
router.get('/:id', productController.getProductById);

// Add/Edit/Delete
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
