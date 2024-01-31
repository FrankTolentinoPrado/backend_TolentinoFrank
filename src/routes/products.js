const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager'); // Ajusta el nombre del archivo según sea necesario

router.get('/', ProductManager.getAllProducts);
router.get('/:pid', ProductManager.getProductById);
router.post('/', ProductManager.addProduct);
router.put('/:pid', ProductManager.updateProduct);
router.delete('/:pid', ProductManager.deleteProduct);

module.exports = router;