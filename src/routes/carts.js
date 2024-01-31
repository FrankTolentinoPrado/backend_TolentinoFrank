const express = require('express');
const router = express.Router();
const CartManager = require('../controllers/CartManager'); 

router.post('/', CartManager.createCart);
router.get('/:cid', CartManager.getCartById);
router.post('/:cid/product/:pid', CartManager.addProductToCart);

module.exports = router;
