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

    addProduct(title, description, price, thumbnail, code, stock) {
        if (![title, description, price, thumbnail, code, stock].every(Boolean)) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log("Ya existe un producto con ese código.");
            return;
        }

        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.saveToFile();
        console.log(`Producto '${title}' agregado correctamente.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const foundProduct = this.products.find(product => product.id === productId);

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

const filePath = 'productos.json';
const manager = new ProductManager(filePath);


manager.addProduct("Funko Pop Pikachu", "Figura coleccionable de Pikachu", 15.99, "/images/pikachu.jpg", "PK001", 50);
manager.addProduct("Peluche Naruto", "Peluche suave de Naruto Uzumaki", 19.99, "/images/naruto.jpg", "NRT001", 30);
manager.addProduct("Funko Pop Charmander", "Figura coleccionable de Charmander", 14.99, "/images/charmander.jpg", "PK002", 40);


const productIdToSearch = 2;
const foundProduct = manager.getProductById(productIdToSearch);
if (foundProduct) {
    console.log(`Producto encontrado por ID ${productIdToSearch}:`);
    console.log(foundProduct);
}


// actualizar un producto
const productIdToUpdate = 2;
const updatedFields = { stock: 35, price: 22.99, description: "Nuevo Peluche Naruto" };
manager.updateProduct(productIdToUpdate, updatedFields);

// Eliminar un producto
const productIdToDelete = 4;
manager.deleteProduct(productIdToDelete);

console.log("Todos los productos después de las operaciones:");
console.log(manager.getProducts());