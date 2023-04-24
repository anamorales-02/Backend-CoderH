const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  generateId() {
    const products = this.getProductsFromFile();
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    return maxId + 1;
  }

  addProduct(product) {
    const products = this.getProductsFromFile();
    const id = this.generateId();
    const newProduct = {
      id,
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      thumbnail: product.thumbnail || '',
      code: product.code || '',
      stock: product.stock || 0
    };
    const existingProduct = products.find(p => p.id === id);
    if (existingProduct) {
      throw new Error(`Producto con id ${id} ya existe.`);
    }
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return newProduct;
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error(`Producto con id ${id} no encontrado.`);
    }
    return product;
  }

  updateProduct(id, updates) {
    const products = this.getProductsFromFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado.`);
    }
    const updatedProduct = { ...products[index], ...updates, id };
    products[index] = updatedProduct;
    fs.writeFileSync(this.path, JSON.stringify(products));
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProductsFromFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado.`);
    }
    products.splice(index, 1);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return true;
  }

  getProductsFromFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]');
    }
    const products = fs.readFileSync(this.path, 'utf8');
    return JSON.parse(products);
  }
}

module.exports = ProductManager;

const productManager = new ProductManager('products.json');

console.log(productManager.getProducts()); // []

const newProduct = productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
});
console.log(newProduct); 

productManager.deleteProduct(1);

