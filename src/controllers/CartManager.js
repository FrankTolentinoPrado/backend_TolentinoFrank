const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.readFromFile();
    }

    readFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data) || [];
        } catch (error) {
            console.log("Error al leer el archivo:", error.message);
            this.carts = [];
        }
    }

    saveToFile() {
        try {
            const data = JSON.stringify(this.carts, null, 2);
            fs.writeFileSync(this.path, data, 'utf8');
            console.log("Datos guardados en el archivo correctamente.");
        } catch (error) {
            console.log("Error al guardar en el archivo:", error.message);
        }
    }

    createCart() {
        const newCart = {
            id: uuidv4(),
            products: []
        };

        this.carts.push(newCart);
        this.saveToFile();
        console.log(`Carrito creado con ID ${newCart.id}`);
        return newCart;
    }

    getCartById(cartId) {
        const foundCart = this.carts.find(cart => cart.id === cartId);

        if (foundCart) {
            return foundCart;
        } else {
            console.log("Carrito no encontrado.");
        }
    }

    addProductToCart(cartId, productId, quantity) {
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);

        if (cartIndex !== -1) {
            const cart = this.carts[cartIndex];
            const existingProductIndex = cart.products.findIndex(product => product.id === productId);

            if (existingProductIndex !== -1) {
                // Si el producto ya existe en el carrito, incrementa la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, agrégalo
                cart.products.push({
                    id: productId,
                    quantity
                });
            }

            this.saveToFile();
            console.log(`Producto con ID ${productId} agregado al carrito ${cartId}`);
            return cart;
        } else {
            console.log("Carrito no encontrado.");
        }
    }
}

module.exports = CartManager;
