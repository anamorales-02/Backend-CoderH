import express from 'express';
import ProductService from '../services/productsService.js';

export const productRouter = express.Router();
const productService = new ProductService();

productRouter.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting products' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: `Product ${productId} not found` });
    }
    res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error getting product' });
  }
});

productRouter.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await productService.createProduct({ name, price, description });
    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating product' });
  }
});

productRouter.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    const updatedProduct = await productService.updateProduct(productId, { name, price, description });
    res.status(200).json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating product' });
  }
});

productRouter.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await productService.deleteProduct(productId);
    res.status(200).json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting product' });
  }
});

export default productRouter;
