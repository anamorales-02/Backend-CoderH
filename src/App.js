const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;
const productManager = new ProductManager('products.json');

app.use(express.json());

app.post('/products', (req, res) => {
  try {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.send({ message: 'Producto agregado correctamente' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  const limit = parseInt(req.query.limit);
  if (limit) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});
app.get('/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
      const product = productManager.getProductById(pid);
      res.send(product);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  });

  
  