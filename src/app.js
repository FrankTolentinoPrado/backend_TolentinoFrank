const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartManager');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

// Rutas para productos
app.get('/api/products', async (req, res, next) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        next(error);
    }
});

app.get('/api/products/:pid', async (req, res, next) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        next(error);
    }
});

app.post('/api/products', async (req, res, next) => {
    try {
        const newProductData = req.body;
        await productManager.addProduct(newProductData);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        next(error);
    }
});

app.put('/api/products/:pid', async (req, res, next) => {
    const productId = req.params.pid;
    try {
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: `Product with ID ${productId} updated successfully` });
    } catch (error) {
        next(error);
    }
});

app.delete('/api/products/:pid', async (req, res, next) => {
    const productId = req.params.pid;
    try {
        await productManager.deleteProduct(productId);
        res.json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
        next(error);
    }
});

// Rutas para carritos
app.post('/api/carts', async (req, res, next) => {
    try {
        const newCart = req.body;
        const createdCart = await cartManager.createCart(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        next(error);
    }
});

app.get('/api/carts/:cid', async (req, res, next) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        next(error);
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res, next) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Cart or Product not found');
        }
    } catch (error) {
        next(error);
    }
});

// Middleware centralizado para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
