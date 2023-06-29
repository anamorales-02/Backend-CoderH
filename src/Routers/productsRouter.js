import express from 'express';
import ProductsService from '../services/productsService.js';

export const productsRouter = express.Router();
const productsService = new ProductsService();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await productsService.getAllProducts();
    res.status(200).json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting products' });
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productsService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: `Product ${productId} not found` });
    }
    res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting product' });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await productsService.createProduct({ name, price, description });
    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating product' });
  }
});

productsRouter.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    const updatedProduct = await productsService.updateProduct(productId, { name, price, description });
    res.status(200).json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating product' });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await productsService.deleteProduct(productId);
    res.status(200).json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting product' });
  }
});

export default productsRouter;
