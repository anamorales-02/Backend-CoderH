import {  productsService } from '../services/productsService.js';
import { sendEmail } from '../utils/emailUtils.js';

class CustomProductsController {
  async getProducts(req, res) {
    try {
      console.log('producttest')
      const limit = 10;
      const products = await  productsService.getProducts(limit);
      res.status(200).json(products);
      console.log(products);
    } catch (err) {
      res.status(500).json({ ErrorMessage: `${err}` });
    }
  }

  async getProductsPaginate(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page);
      const filter = req.query.filter || '';
      const sort = req.query.sort ? req.query.sort : '';
      const attName = req.query.attName || '';
      const products = await  productsService.getProductsPaginate(limit, page, filter, sort, attName);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ ErrorMessage: `${err}` });
    }
  }

  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      const product = await  productsService.getProductById(pid);
      res.status(200).json(product);
    } catch (err) {
      res.status(404).json({ ErrorMessage: `${err}` });
    };
  }

  async createProduct(req, res) {
    try {
      const { title, description, price, code, stock, category, thumbnail } = req.body.product;
      const productToCreate = await  productsService.createProduct({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        owner: "admin",
        thumbnail
      });
      return res.status(201).json({ product: productToCreate });
    } catch (err) {
      res.status(500).json({ ErrorMessage: `${err}` });
    }
  }

  async updateProduct(req, res) {
    const { pid } = req.params;
    const fieldsToUpdate = req.body;
    try {
      const product = await  productsService.updateProduct(pid, fieldsToUpdate);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ ErrorMessage: `${err}` });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const removed = await  productsService.deleteProduct(pid);
      if (!removed) {
        return res.status(404).json({ ErrorMessage: 'Product not found' });
      }
      const userEmail = removed.owner?.email || null;
      const productName = removed.title;
      if (userEmail) {
        sendEmail(userEmail, productName);
      }
      res.status(204).send();
    } catch (err) {
      console.log(err);
      res.status(500).json({ ErrorMessage: `${err}` });
    }
  }

  async renderRealtimeProducts(req, res) {
    try {
      const sessionUser = req.session.user;
      const products = await  productsService.getProducts();
      if (sessionUser?.isPremium == true) {
        const userProducts = products.filter((p) => p.owner === sessionUser._id);
        res.status(200).render('realtimeproducts', { products: userProducts, sessionUser });
      } else {
        res.status(200).render('realtimeproducts', { products, sessionUser });
      }
    } catch (err) {
      res.status(500).alert({ ErrorMessage: `1${err}` });
    }
  }

  async renderProductsPage(req, res) {
    try {
     console.log('renderProductsPage')
      const products = await  productsService.getProducts();
      console.log(products);
      const sessionUser = req.session.user;
      res.status(200).render('products', { products, sessionUser });
    } catch (err) {
      res.status(500).alert({ ErrorMessage: `1${err}` });
    }
  }
}

export const customProductsController = new CustomProductsController();
