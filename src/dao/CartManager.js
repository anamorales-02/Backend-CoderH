import fs from 'fs';
import productManager from './ProductManager.js';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
    }

    async retrieveCarts() {
        if (fs.existsSync(this.filePath)) {
            const cartsString = await fs.promises.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(cartsString);
            this.carts = carts;
        } else {
            await fs.promises.writeFile(this.filePath, '[]');
            const cartsString = await fs.promises.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(cartsString);
            this.carts = carts;
        }
        return this.carts;
    }

    async addCart(cartId) {
        let carts = await this.retrieveCarts();
        let products = [];
        if (carts.some((cart) => cart.id === cartId)) {
            return { error: `The cart with id ${cartId} already exists` };
        }
        let id = cartId;
        let newCart = { id, products };
        carts.push(newCart);
        const cartsString = JSON.stringify(carts, null, 2);
        await fs.promises.writeFile(this.filePath, cartsString);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        try {
            let data = await this.retrieveCarts();
            let cart = await this.getCartById(cartId);
            if (cart) {
                let product = await productManager.getProductById(productId);
                if (product) {
                    const productFind = cart.products.find(product => product.idProduct === productId);
                    if (productFind) {
                        productFind.quantity = productFind.quantity + 1;
                        let cartIndex = data.findIndex(cart => cart.id === cartId);
                        data.splice(cartIndex, 1, cart);
                        const cartString = JSON.stringify(data, null, 2);
                        await fs.promises.writeFile(this.filePath, cartString);
                        return cart;
                    }
                    cart.products.push({ idProduct: productId, quantity: 1 });
                    let cartIndex = data.findIndex(cart => cart.id === cartId);
                    data.splice(cartIndex, 1, cart);
                    const cartString = JSON.stringify(data, null, 2);
                    await fs.promises.writeFile(this.filePath, cartString);
                    return cart;
                }
                return { error: 'Product does not exist' };
            }
            return { error: 'Cart does not exist' };
        } catch (error) {
            return new Error(error);
        }
    }

    async getCartById(idSearch) {
        try {
            let cart = await this.getCartIndex(idSearch);
            if (cart) {
                return cart;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCartIndex(idSearch) {
        let data = await this.retrieveCarts();
        try {
            const cartIndexById = data.find(element => element.id === idSearch);
            if (cartIndexById) {
                return cartIndexById;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new CartManager('./src/persistencia/carts.json');
