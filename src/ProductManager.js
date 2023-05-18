const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = "./product.json";
    this.products = [];
    this.productList = [
      {
        id: 4,
        title: "Camiseta de algodón",
        description: "Camiseta cómoda y ligera",
        price: 15.99,
        thumbnail: "https://example.com/camiseta.jpg",
        code: "a104",
        stock: 20,
        status: true
      },
      {
        id: 5,
        title: "Jeans",
        description: "Jeans modernos y de alta calidad",
        price: 49.99,
        thumbnail: "https://example.com/jeans.jpg",
        code: "a105",
        stock: 15,
        status: true
      },
      {
        id: 6,
        title: "Sudadera con capucha",
        description: "Sudadera cómoda y abrigada",
        price: 29.99,
        thumbnail: "https://example.com/sudadera.jpg",
        code: "a106",
        stock: 25,
        status: true
      }
    ];
  }

  async getData() {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } else {
      this.products = [...this.productList];
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    return this.products;
  }

  async addProduct(product) {
    await this.getData();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return "The content of the fields is wrong.";
    }

    if (this.products.some((item) => item.code === product.code)) {
      return "Product already exists.";
    }

    const maxId =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id))
        : 0;
    const newId = maxId + 1;

    const newProduct = { id: newId, ...product, status: true };
    this.products.push(newProduct);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product added successfully.";
  }

  async getProducts() {
    await this.getData();
    return this.products;
  }

  async getProductById(id) {
    await this.getData();
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return "Product not found.";
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    await this.getData();
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return "Product not found.";
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProduct,
    };

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product updated successfully.";
  }

  async deleteProduct(id) {
    await this.getData();
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return "Product not found.";
    }

    this.products.splice(productIndex, 1);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product deleted successfully.";
  }
}

module.exports = ProductManager;

