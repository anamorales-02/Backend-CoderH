class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Intento fallido. Asegúrese de que se proporcionen todos los datos solicitados.");
      return;
    }
    
    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      console.log(`El producto con el codigo ${product.code} ya existe. Por favor elige un código diferente.`);
      return;
    }

    const newProduct = {
      id: this.nextId++,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    }
    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.log(`Producto con id ${id} no encontrado.`);
    }
    return product;
  }
}
// Ejemplo al agregar un producto
const productManager = new ProductManager();

productManager.addProduct({
  title: "Product 1",
  description: "This is the first product",
  price: 9.99,
  thumbnail: "https://example.com/product1.jpg",
  code: "ABC123",
  stock: 100
});

const products = productManager.getProducts();
console.log(products);

// Por id
const product = productManager.getProductById(1);
console.log(product);

  


