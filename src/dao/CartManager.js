const fs = require("fs");

class CartManager {
  constructor(fileName) {
    this.filePath = `./${fileName}.json`;
    this.carts = [];
  }

  async loadData() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts));
    }
  }

  async saveData() {
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.carts, null, 2)
    );
  }

  async addCart(cart) {
    await this.loadData();

    const maxId =
      this.carts.length > 0 ? Math.max(...this.carts.map((p) => p.id)) : 0;
    const newId = maxId + 1;

    const newCart = { id: newId, ...cart };
    this.carts.push(newCart);

    await this.saveData();

    return "Cart added successfully.";
  }

  async getCarts() {
    await this.loadData();
    return this.carts;
  }

  async getCartById(id) {
    await this.loadData();
    const cart = this.carts.find((p) => p.id === id);
    if (!cart) {
      return "Cart not found.";
    }
    return cart;
  }

  async updateCart(cartId, productId) {
    await this.loadData();
    const cart = this.carts.find((p) => p.id === cartId);

    if (!cart) {
      return "Cart not found.";
    }

    const product = cart.products.find((p) => p.id === productId);

    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }

    await this.saveData();

    return cart;
  }
}

module.exports = CartManager;
