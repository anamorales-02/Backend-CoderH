const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const cartsRouter = express.Router();
const ProductManager = require('../dao/ProductManager');
const cartManager = new ProductManager(path.join(__dirname, '../../carts.json')); // Ruta al archivo carts.json

let carts = [];

try {
  carts = JSON.parse(fs.readFileSync(path.join(__dirname, '../../carts.json')));
} catch (error) {
  console.log(`Error reading carts from file: ${error}`);
}

cartsRouter.get('/', async (req, res) => {
  try {
    const products = await cartManager.getProducts();
    const limit = req.query.limit;
    if (!limit) {
      return res.status(200).json(products);
    } else {
      return res.status(200).json(products.slice(0, limit));
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

cartsRouter.post('/', (req, res) => {
  try {
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    fs.writeFileSync(path.join(__dirname, '../../carts.json'), JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

cartsRouter.get('/:cid', (req, res) => {
  const cart = carts.find((c) => c.id === req.params.cid);
  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
  } else {
    res.json(cart);
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const cart = carts.find((c) => c.id === cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const existingProduct = cart.products.find((p) => p.id === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ id: productId, quantity });
  }

  fs.writeFileSync(path.join(__dirname, '../../carts.json'), JSON.stringify(carts, null, 2));
  res.status(200).json(cart);
});

module.exports = cartsRouter;
