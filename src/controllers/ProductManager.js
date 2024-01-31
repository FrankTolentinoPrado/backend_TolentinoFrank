const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.readFromFile();
    }

    readFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data) || [];
        } catch (error) {
            console.log("Error al leer el archivo:", error.message);
            this.products = [];
        }
    }

    saveToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data, 'utf8');
            console.log("Datos guardados en el archivo correctamente.");
        } catch (error) {
            console.log("Error al guardar en el archivo:", error.message);
        }
    }

    generateId() {
        return this.products.length + 1;
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock, category } = productData;

        if (![title, description, price, thumbnail, code, stock, category].every(Boolean)) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log("Ya existe un producto con ese código.");
            return;
        }

        const newProduct = {
            id: this.generateId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status: true, 
            thumbnails: [], 
        };

        this.products.push(newProduct);
        this.saveToFile();
        console.log(`Producto '${title}' agregado correctamente.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const foundProduct = this.products.find(product => product.id === parseInt(productId));

        if (foundProduct) {
            return foundProduct;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveToFile();
            console.log(`Producto con ID ${productId} actualizado correctamente.`);
        } else {
            console.log("Producto no encontrado.");
        }
    }

    deleteProduct(productId) {
        const productIndex = this.products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveToFile();
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
        } else {
            console.log("Producto no encontrado.");
        }
    }
}

module.exports = ProductManager;





















