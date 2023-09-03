import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
    }

    async retrieveProducts() {
        if (fs.existsSync(this.filePath)) {
            const productsString = await fs.promises.readFile(this.filePath, 'utf-8');
            const products = JSON.parse(productsString);
            this.products = products;
        } else {
            await fs.promises.writeFile(this.filePath, '[]');
            const productsString = await fs.promises.readFile(this.filePath, 'utf-8');
            const products = JSON.parse(productsString);
            this.products = products;
        }
        return this.products;
    }

    async addProduct(newProduct) {
        let id = uuidv4();

        try {
            let products = await this.retrieveProducts();
            if (
                !newProduct.title ||
                !newProduct.description ||
                !newProduct.price ||
                !newProduct.thumbnail ||
                !newProduct.code ||
                !newProduct.category ||
                !newProduct.stock
            ) {
                return 'Complete all fields';
            } else {
                if (products.some((product) => product.code === newProduct.code)) {
                    return { error: `The product with SKU: ${newProduct.code} already exists` };
                } else {
                    newProduct.stock = parseInt(newProduct.stock);
                    newProduct.price = parseInt(newProduct.price);
                    newProduct.id = id;
                    products.push(newProduct);
                    const productsString = JSON.stringify(products, null, 2);
                    await fs.promises.writeFile(this.filePath, productsString);
                    return newProduct;
                }
            }
        } catch (error) {
            return new Error(error);
        }
    }

    async getProductById(idSearch) {
        try {
            let data = await this.retrieveProducts();
            let id = parseInt(idSearch);
            const productById = data.find(element => element.id === id);
            return productById;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(updateId, dataUpdate) {
        let products = await this.retrieveProducts();
        const productIndex = products.findIndex(element => element.id === updateId);
        if (productIndex === -1) {
            return { error: 'Product not found' };
        } else {
            if (typeof (dataUpdate) === 'object') {
                products[productIndex] = { ...products[productIndex], ...dataUpdate, id: products[productIndex].id };
                const productsString = JSON.stringify(products, null, 2);
                await fs.promises.writeFile(this.filePath, productsString);
                return products[productIndex];
            } else {
                return { error: 'You must send an object' };
            }
        }
    }

    async deleteProduct(deleteId) {
        try {
            let id = deleteId;
            let products = await this.retrieveProducts();
            const productIndex = products.findIndex(element => element.id === id);
            if (productIndex >= 0) {
                products = products.filter((item) => item.id !== id);
                const productsString = JSON.stringify(products, null, 2);
                await fs.promises.writeFile(this.filePath, productsString);
                return 'Product deleted';
            }
        } catch (error) {
            return;
        }
    }
}

export default new ProductManager('./src/persistencia/products.json');
